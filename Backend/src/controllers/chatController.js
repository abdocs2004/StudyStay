import db from '../config/db.js';
import { createNotification } from './notificationController.js';
import { hasUnlock } from './paymentController.js';
import { filterMessage } from '../utils/messageFilter.js';

const getConversationById = async (req, res) => {
  const { id: conversationId } = req.params;
  const { id: userId } = req.user;

  try {
    const [rows] = await db.query(
      `SELECT c.*, 
              s.name AS student_name,
              s.role AS student_role,
              o.name AS owner_name,
              o.role AS owner_role,
              p.title AS property_title,
              p.city AS property_city
       FROM conversations c
       JOIN users s ON s.id = c.student_id
       JOIN users o ON o.id = c.owner_id
       LEFT JOIN properties p ON p.id = c.property_id
       WHERE c.id = ? AND (? IN (c.student_id, c.owner_id))`
      , [conversationId, userId]
    );

    if (rows.length === 0) {
      return res.status(404).json({ message: 'المحادثة غير موجودة أو لا تملك صلاحية الوصول إليها' });
    }

    return res.json(rows[0]);
  } catch (error) {
    console.error('Error fetching conversation:', error);
    return res.status(500).json({ message: 'حدث خطأ أثناء جلب بيانات المحادثة' });
  }
};

const getConversations = async (req, res) => {
  const { id: userId } = req.user;

  try {
    const [rows] = await db.query(
      `SELECT c.id,
              c.student_id,
              c.owner_id,
              c.property_id,
              CASE WHEN c.student_id = ? THEN o.id ELSE s.id END AS other_user_id,
              CASE WHEN c.student_id = ? THEN o.name ELSE s.name END AS other_user_name,
              CASE WHEN c.student_id = ? THEN o.role ELSE s.role END AS other_user_role,
              p.title AS property_title,
              p.city AS property_city,
              m.last_message,
              m.last_message_time,
              IFNULL(unread.unread_count, 0) AS unread_count
       FROM conversations c
       JOIN users s ON s.id = c.student_id
       JOIN users o ON o.id = c.owner_id
       LEFT JOIN properties p ON p.id = c.property_id
       LEFT JOIN (
         SELECT m1.conversation_id,
                m1.message AS last_message,
                m1.created_at AS last_message_time
         FROM messages m1
         JOIN (
           SELECT conversation_id, MAX(id) AS max_id
           FROM messages
           GROUP BY conversation_id
         ) lm ON lm.conversation_id = m1.conversation_id AND lm.max_id = m1.id
       ) m ON m.conversation_id = c.id
       LEFT JOIN (
         SELECT conversation_id, COUNT(*) AS unread_count
         FROM messages
         WHERE receiver_id = ? AND is_read = 0
         GROUP BY conversation_id
       ) unread ON unread.conversation_id = c.id
       WHERE c.student_id = ? OR c.owner_id = ?
       ORDER BY m.last_message_time DESC, c.created_at DESC`
      , [userId, userId, userId, userId, userId, userId]
    );

    return res.json(rows);
  } catch (error) {
    console.error('Error fetching conversations:', error);
    return res.status(500).json({ message: 'حدث خطأ أثناء جلب قائمة المحادثات' });
  }
};

const getMessages = async (req, res) => {
  const { id: userId } = req.user;
  const { conversationId } = req.params;

  try {
    const [conversationRows] = await db.query(
      'SELECT * FROM conversations WHERE id = ? AND (? IN (student_id, owner_id))',
      [conversationId, userId]
    );

    if (conversationRows.length === 0) {
      return res.status(404).json({ message: 'المحادثة غير موجودة أو غير مصرح لك بالوصول إليها' });
    }

    const [messages] = await db.query(
      'SELECT * FROM messages WHERE conversation_id = ? ORDER BY created_at ASC',
      [conversationId]
    );

    return res.json(messages);
  } catch (error) {
    console.error('Error fetching messages:', error);
    return res.status(500).json({ message: 'حدث خطأ أثناء جلب الرسائل' });
  }
};

const markMessagesRead = async (req, res) => {
  const { id: userId } = req.user;
  const { conversationId } = req.params;

  try {
    const [conversationRows] = await db.query(
      'SELECT * FROM conversations WHERE id = ? AND (? IN (student_id, owner_id))',
      [conversationId, userId]
    );

    if (conversationRows.length === 0) {
      return res.status(404).json({ message: 'المحادثة غير موجودة أو غير مصرح لك بالوصول إليها' });
    }

    const [result] = await db.query(
      'UPDATE messages SET is_read = 1 WHERE conversation_id = ? AND receiver_id = ? AND is_read = 0',
      [conversationId, userId]
    );

    return res.json({ updated: result.affectedRows });
  } catch (error) {
    console.error('Error updating read status:', error);
    return res.status(500).json({ message: 'حدث خطأ أثناء تحديث حالة القراءة' });
  }
};

const sendMessage = async (req, res) => {
  const { id: senderId } = req.user;
  const { conversation_id, message, receiver_id: fallbackReceiverId } = req.body;

  if (!message || message.trim() === '') {
    return res.status(400).json({ message: 'الرجاء كتابة نص الرسالة' });
  }

  try {
    let receiverId = fallbackReceiverId || null;
    let propertyId = null;
    let conversationId = conversation_id || null;

    if (conversationId) {
      const [conversationRows] = await db.query(
        'SELECT * FROM conversations WHERE id = ? AND (? IN (student_id, owner_id))',
        [conversationId, senderId]
      );

      if (conversationRows.length === 0) {
        return res.status(404).json({ message: 'المحادثة غير موجودة أو غير مصرح لك بالوصول إليها' });
      }

      const conversation = conversationRows[0];
      receiverId = conversation.student_id === senderId ? conversation.owner_id : conversation.student_id;
      propertyId = conversation.property_id;
    }

    if (!receiverId) {
      return res.status(400).json({ message: 'الرجاء تحديد المستقبل أو معرّف المحادثة' });
    }

    // Once either side has paid to unlock the other's contact info, they've
    // already exchanged it through the platform's official flow — no need
    // to keep filtering their chat.
    const unlocked = (await hasUnlock(senderId, receiverId)) || (await hasUnlock(receiverId, senderId));

    let messageToStore = message.trim();
    let wasFiltered = false;

    if (!unlocked) {
      const result = filterMessage(messageToStore);
      messageToStore = result.filtered;
      wasFiltered = result.wasFiltered;
    }

    const [result] = await db.query(
      'INSERT INTO messages (sender_id, receiver_id, property_id, conversation_id, message) VALUES (?, ?, ?, ?, ?)',
      [senderId, receiverId, propertyId, conversationId, messageToStore]
    );

    const [messageRows] = await db.query('SELECT * FROM messages WHERE id = ?', [result.insertId]);

    const [senderRows] = await db.query('SELECT name FROM users WHERE id = ?', [senderId]);
    const senderName = senderRows[0]?.name || 'مستخدم';
    await createNotification(
      receiverId,
      'رسالة جديدة',
      `${senderName} أرسل لك رسالة جديدة: "${messageToStore.slice(0, 80)}"`
    );

    return res.status(201).json({
      ...messageRows[0],
      warning: wasFiltered
        ? 'لا يمكن مشاركة بيانات التواصل قبل الموافقة على الدفع. تم إخفاء بعض المحتوى.'
        : null,
    });
  } catch (error) {
    console.error('Error sending message:', error);
    return res.status(500).json({ message: 'حدث خطأ أثناء إرسال الرسالة' });
  }
};

const getOrCreateConversation = async (req, res) => {
  const { id: currentUserId } = req.user;
  const { student_id, owner_id, property_id } = req.body;

  if (!student_id || !owner_id) {
    return res.status(400).json({ message: 'الرجاء تحديد الطالب والمالك للمحادثة' });
  }

  if (currentUserId !== student_id && currentUserId !== owner_id) {
    return res.status(403).json({ message: 'غير مسموح بإنشاء محادثة بين طرفين آخرين' });
  }

  try {
    const query = property_id ?
      'SELECT * FROM conversations WHERE student_id = ? AND owner_id = ? AND property_id = ? LIMIT 1' :
      'SELECT * FROM conversations WHERE student_id = ? AND owner_id = ? AND property_id IS NULL LIMIT 1';
    const params = property_id ? [student_id, owner_id, property_id] : [student_id, owner_id];
    const [existingRows] = await db.query(query, params);

    if (existingRows.length > 0) {
      return res.json(existingRows[0]);
    }

    const [result] = await db.query(
      'INSERT INTO conversations (student_id, owner_id, property_id) VALUES (?, ?, ?)',
      [student_id, owner_id, property_id || null]
    );

    const [createdRows] = await db.query('SELECT * FROM conversations WHERE id = ?', [result.insertId]);
    return res.status(201).json(createdRows[0]);
  } catch (error) {
    console.error('Error creating conversation:', error);
    return res.status(500).json({ message: 'حدث خطأ أثناء إنشاء المحادثة' });
  }
};

export {
  getConversationById,
  getConversations,
  getMessages,
  markMessagesRead,
  sendMessage,
  getOrCreateConversation,
};
