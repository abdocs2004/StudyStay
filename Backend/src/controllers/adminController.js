import bcrypt from 'bcryptjs';
import db from '../config/db.js';
import { createNotification } from './notificationController.js';

// ==================== DASHBOARD STATS ====================

// @desc    Aggregate platform statistics for the admin dashboard
// @route   GET /api/admin/stats
// @access  Private/Admin
export const getStats = async (req, res) => {
  try {
    const [[userCounts]] = await db.query(`
      SELECT
        COUNT(*) AS total_users,
        SUM(role = 'student') AS students,
        SUM(role = 'owner') AS owners,
        SUM(role = 'admin') AS admins
      FROM users
    `);

    const [[propertyCounts]] = await db.query(`
      SELECT
        COUNT(*) AS total_properties,
        SUM(approval_status = 'pending') AS pending_properties,
        SUM(approval_status = 'approved') AS approved_properties,
        SUM(approval_status = 'rejected') AS rejected_properties
      FROM properties
    `);

    const [[postCounts]] = await db.query(`
      SELECT
        COUNT(*) AS total_posts,
        SUM(approval_status = 'pending') AS pending_posts,
        SUM(approval_status = 'approved') AS approved_posts,
        SUM(approval_status = 'rejected') AS rejected_posts
      FROM posts
    `);

    const [[messageCounts]] = await db.query('SELECT COUNT(*) AS total_messages FROM messages');

    const [[paymentCounts]] = await db.query(`
      SELECT
        COUNT(*) AS total_payments,
        SUM(status = 'pending') AS pending_payments,
        SUM(status = 'approved') AS approved_payments,
        SUM(status = 'rejected') AS rejected_payments,
        COALESCE(SUM(CASE WHEN status = 'approved' THEN amount ELSE 0 END), 0) AS revenue
      FROM payment_requests
    `);

    return res.json({
      users: userCounts,
      properties: propertyCounts,
      posts: postCounts,
      messages: messageCounts,
      payments: paymentCounts,
    });
  } catch (error) {
    console.error('Error fetching admin stats:', error);
    return res.status(500).json({ message: 'حدث خطأ أثناء جلب إحصائيات المنصة' });
  }
};

// @desc    Recent activity feed (latest signups, properties, payments)
// @route   GET /api/admin/activity
// @access  Private/Admin
export const getRecentActivity = async (req, res) => {
  try {
    const [recentUsers] = await db.query(
      'SELECT id, name, role, created_at FROM users ORDER BY created_at DESC LIMIT 5'
    );
    const [recentProperties] = await db.query(
      'SELECT id, title, approval_status, created_at FROM properties ORDER BY created_at DESC LIMIT 5'
    );
    const [recentPayments] = await db.query(
      `SELECT pr.id, pr.status, pr.amount, pr.payment_method, pr.created_at, u.name AS payer_name
       FROM payment_requests pr JOIN users u ON pr.payer_id = u.id
       ORDER BY pr.created_at DESC LIMIT 5`
    );

    return res.json({ recentUsers, recentProperties, recentPayments });
  } catch (error) {
    console.error('Error fetching recent activity:', error);
    return res.status(500).json({ message: 'حدث خطأ أثناء جلب النشاط الأخير' });
  }
};

// ==================== USER MANAGEMENT ====================

// @desc    List/search/filter users
// @route   GET /api/admin/users?search=&role=
// @access  Private/Admin
export const getUsers = async (req, res) => {
  const { search, role } = req.query;

  try {
    let query = `SELECT id, name, email, role, phone, university, is_suspended, verification_status, created_at FROM users WHERE 1=1`;
    const params = [];

    if (search) {
      query += ' AND (name LIKE ? OR email LIKE ?)';
      params.push(`%${search}%`, `%${search}%`);
    }

    if (role) {
      query += ' AND role = ?';
      params.push(role);
    }

    query += ' ORDER BY created_at DESC';

    const [rows] = await db.query(query, params);
    return res.json(rows);
  } catch (error) {
    console.error('Error fetching users:', error);
    return res.status(500).json({ message: 'حدث خطأ أثناء جلب المستخدمين' });
  }
};

// @desc    Get a single user's full profile (admin view)
// @route   GET /api/admin/users/:id
// @access  Private/Admin
export const getUserProfile = async (req, res) => {
  try {
    const [rows] = await db.query(
      'SELECT id, name, email, role, phone, university, bio, profile_image, is_suspended, verification_status, created_at FROM users WHERE id = ?',
      [req.params.id]
    );
    if (rows.length === 0) {
      return res.status(404).json({ message: 'المستخدم غير موجود' });
    }
    return res.json(rows[0]);
  } catch (error) {
    console.error('Error fetching user profile:', error);
    return res.status(500).json({ message: 'حدث خطأ أثناء جلب بيانات المستخدم' });
  }
};

// @desc    Suspend a user account
// @route   POST /api/admin/users/:id/suspend
// @access  Private/Admin
export const suspendUser = async (req, res) => {
  try {
    await db.query('UPDATE users SET is_suspended = 1 WHERE id = ?', [req.params.id]);
    return res.json({ message: 'تم تعليق الحساب' });
  } catch (error) {
    console.error('Error suspending user:', error);
    return res.status(500).json({ message: 'حدث خطأ أثناء تعليق الحساب' });
  }
};

// @desc    Reactivate a suspended user account
// @route   POST /api/admin/users/:id/activate
// @access  Private/Admin
export const activateUser = async (req, res) => {
  try {
    await db.query('UPDATE users SET is_suspended = 0 WHERE id = ?', [req.params.id]);
    return res.json({ message: 'تم تفعيل الحساب' });
  } catch (error) {
    console.error('Error activating user:', error);
    return res.status(500).json({ message: 'حدث خطأ أثناء تفعيل الحساب' });
  }
};

// @desc    Delete a user account
// @route   DELETE /api/admin/users/:id
// @access  Private/Admin
export const deleteUser = async (req, res) => {
  try {
    if (Number(req.params.id) === req.user.id) {
      return res.status(400).json({ message: 'لا يمكنك حذف حسابك الخاص' });
    }
    await db.query('DELETE FROM users WHERE id = ?', [req.params.id]);
    return res.json({ message: 'تم حذف المستخدم' });
  } catch (error) {
    console.error('Error deleting user:', error);
    return res.status(500).json({ message: 'حدث خطأ أثناء حذف المستخدم' });
  }
};

// @desc    Reset a user's password to a temporary one (returned once to the admin)
// @route   POST /api/admin/users/:id/reset-password
// @access  Private/Admin
export const resetUserPassword = async (req, res) => {
  try {
    const tempPassword = Math.random().toString(36).slice(-10);
    const hashedPassword = await bcrypt.hash(tempPassword, 10);
    const [result] = await db.query('UPDATE users SET password = ? WHERE id = ?', [hashedPassword, req.params.id]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'المستخدم غير موجود' });
    }

    return res.json({ message: 'تم إعادة تعيين كلمة المرور', temporaryPassword: tempPassword });
  } catch (error) {
    console.error('Error resetting password:', error);
    return res.status(500).json({ message: 'حدث خطأ أثناء إعادة تعيين كلمة المرور' });
  }
};

// ==================== PROPERTY MANAGEMENT ====================

// @desc    List all properties for moderation (any status)
// @route   GET /api/admin/properties?status=
// @access  Private/Admin
export const getAllProperties = async (req, res) => {
  const { status } = req.query;

  try {
    let query = `
      SELECT p.*, u.name AS owner_name, u.email AS owner_email
      FROM properties p
      JOIN users u ON p.owner_id = u.id
      WHERE 1=1
    `;
    const params = [];

    if (status) {
      query += ' AND p.approval_status = ?';
      params.push(status);
    }

    query += ' ORDER BY p.created_at DESC';

    const [rows] = await db.query(query, params);
    return res.json(rows);
  } catch (error) {
    console.error('Error fetching properties for admin:', error);
    return res.status(500).json({ message: 'حدث خطأ أثناء جلب العقارات' });
  }
};

// @desc    Approve a property
// @route   POST /api/admin/properties/:id/approve
// @access  Private/Admin
export const approveProperty = async (req, res) => {
  try {
    const [rows] = await db.query('SELECT owner_id, title FROM properties WHERE id = ?', [req.params.id]);
    if (rows.length === 0) return res.status(404).json({ message: 'العقار غير موجود' });

    await db.query(
      "UPDATE properties SET approval_status = 'approved', rejection_reason = NULL WHERE id = ?",
      [req.params.id]
    );

    await createNotification(rows[0].owner_id, 'تمت الموافقة على عقارك', `تمت الموافقة على عقارك "${rows[0].title}" وهو الآن ظاهر للطلاب.`);

    return res.json({ message: 'تمت الموافقة على العقار' });
  } catch (error) {
    console.error('Error approving property:', error);
    return res.status(500).json({ message: 'حدث خطأ أثناء الموافقة على العقار' });
  }
};

// @desc    Reject a property with a reason
// @route   POST /api/admin/properties/:id/reject
// @access  Private/Admin
export const rejectProperty = async (req, res) => {
  const { reason } = req.body;

  try {
    const [rows] = await db.query('SELECT owner_id, title FROM properties WHERE id = ?', [req.params.id]);
    if (rows.length === 0) return res.status(404).json({ message: 'العقار غير موجود' });

    await db.query(
      "UPDATE properties SET approval_status = 'rejected', rejection_reason = ? WHERE id = ?",
      [reason || 'لم يتم استيفاء شروط النشر', req.params.id]
    );

    await createNotification(
      rows[0].owner_id,
      'تم رفض عقارك',
      `تم رفض عقارك "${rows[0].title}". السبب: ${reason || 'لم يتم استيفاء شروط النشر'}`
    );

    return res.json({ message: 'تم رفض العقار' });
  } catch (error) {
    console.error('Error rejecting property:', error);
    return res.status(500).json({ message: 'حدث خطأ أثناء رفض العقار' });
  }
};

// @desc    Delete a property (admin)
// @route   DELETE /api/admin/properties/:id
// @access  Private/Admin
export const adminDeleteProperty = async (req, res) => {
  try {
    await db.query('DELETE FROM properties WHERE id = ?', [req.params.id]);
    return res.json({ message: 'تم حذف العقار' });
  } catch (error) {
    console.error('Error deleting property (admin):', error);
    return res.status(500).json({ message: 'حدث خطأ أثناء حذف العقار' });
  }
};

// ==================== STUDENT REQUEST MANAGEMENT ====================

// @desc    List all posts for moderation (any status)
// @route   GET /api/admin/posts?status=
// @access  Private/Admin
export const getAllPosts = async (req, res) => {
  const { status } = req.query;

  try {
    let query = `
      SELECT po.*, u.name AS student_name, u.email AS student_email
      FROM posts po
      JOIN users u ON po.student_id = u.id
      WHERE 1=1
    `;
    const params = [];

    if (status) {
      query += ' AND po.approval_status = ?';
      params.push(status);
    }

    query += ' ORDER BY po.created_at DESC';

    const [rows] = await db.query(query, params);
    return res.json(rows);
  } catch (error) {
    console.error('Error fetching posts for admin:', error);
    return res.status(500).json({ message: 'حدث خطأ أثناء جلب طلبات السكن' });
  }
};

// @desc    Approve a student housing request
// @route   POST /api/admin/posts/:id/approve
// @access  Private/Admin
export const approvePost = async (req, res) => {
  try {
    const [rows] = await db.query('SELECT student_id FROM posts WHERE id = ?', [req.params.id]);
    if (rows.length === 0) return res.status(404).json({ message: 'الطلب غير موجود' });

    await db.query("UPDATE posts SET approval_status = 'approved', rejection_reason = NULL WHERE id = ?", [req.params.id]);
    await createNotification(rows[0].student_id, 'تمت الموافقة على طلبك', 'تمت الموافقة على طلب السكن الخاص بك وهو الآن ظاهر للملاك.');

    return res.json({ message: 'تمت الموافقة على الطلب' });
  } catch (error) {
    console.error('Error approving post:', error);
    return res.status(500).json({ message: 'حدث خطأ أثناء الموافقة على الطلب' });
  }
};

// @desc    Reject a student housing request with a reason
// @route   POST /api/admin/posts/:id/reject
// @access  Private/Admin
export const rejectPost = async (req, res) => {
  const { reason } = req.body;

  try {
    const [rows] = await db.query('SELECT student_id FROM posts WHERE id = ?', [req.params.id]);
    if (rows.length === 0) return res.status(404).json({ message: 'الطلب غير موجود' });

    await db.query(
      "UPDATE posts SET approval_status = 'rejected', rejection_reason = ? WHERE id = ?",
      [reason || 'لم يتم استيفاء شروط النشر', req.params.id]
    );

    await createNotification(
      rows[0].student_id,
      'تم رفض طلبك',
      `تم رفض طلب السكن الخاص بك. السبب: ${reason || 'لم يتم استيفاء شروط النشر'}`
    );

    return res.json({ message: 'تم رفض الطلب' });
  } catch (error) {
    console.error('Error rejecting post:', error);
    return res.status(500).json({ message: 'حدث خطأ أثناء رفض الطلب' });
  }
};

// @desc    Delete a student housing request (admin)
// @route   DELETE /api/admin/posts/:id
// @access  Private/Admin
export const adminDeletePost = async (req, res) => {
  try {
    await db.query('DELETE FROM posts WHERE id = ?', [req.params.id]);
    return res.json({ message: 'تم حذف الطلب' });
  } catch (error) {
    console.error('Error deleting post (admin):', error);
    return res.status(500).json({ message: 'حدث خطأ أثناء حذف الطلب' });
  }
};

// ==================== PAYMENT MANAGEMENT ====================

// @desc    List all payment requests
// @route   GET /api/admin/payments?status=
// @access  Private/Admin
export const getAllPayments = async (req, res) => {
  const { status } = req.query;

  try {
    let query = `
      SELECT pr.*, payer.name AS payer_name, payer.email AS payer_email,
             target.name AS target_name, target.email AS target_email,
             prop.title AS property_title, po.description AS post_description
      FROM payment_requests pr
      JOIN users payer ON pr.payer_id = payer.id
      JOIN users target ON pr.target_user_id = target.id
      LEFT JOIN properties prop ON pr.property_id = prop.id
      LEFT JOIN posts po ON pr.post_id = po.id
      WHERE 1=1
    `;
    const params = [];

    if (status) {
      query += ' AND pr.status = ?';
      params.push(status);
    }

    query += ' ORDER BY pr.created_at DESC';

    const [rows] = await db.query(query, params);
    return res.json(rows);
  } catch (error) {
    console.error('Error fetching payment requests for admin:', error);
    return res.status(500).json({ message: 'حدث خطأ أثناء جلب طلبات الدفع' });
  }
};

// @desc    Approve a payment request — permanently unlocks contact info for that user pair
// @route   POST /api/admin/payments/:id/approve
// @access  Private/Admin
export const approvePayment = async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM payment_requests WHERE id = ?', [req.params.id]);
    if (rows.length === 0) return res.status(404).json({ message: 'طلب الدفع غير موجود' });

    await db.query(
      "UPDATE payment_requests SET status = 'approved', approved_at = NOW(), admin_notes = ? WHERE id = ?",
      [req.body.notes || null, req.params.id]
    );

    await createNotification(
      rows[0].payer_id,
      'تم فتح بيانات التواصل',
      'تمت الموافقة على طلب الدفع الخاص بك، ويمكنك الآن رؤية بيانات التواصل الكاملة.'
    );

    return res.json({ message: 'تمت الموافقة على طلب الدفع وفتح بيانات التواصل' });
  } catch (error) {
    console.error('Error approving payment:', error);
    return res.status(500).json({ message: 'حدث خطأ أثناء الموافقة على طلب الدفع' });
  }
};

// @desc    Reject a payment request
// @route   POST /api/admin/payments/:id/reject
// @access  Private/Admin
export const rejectPayment = async (req, res) => {
  try {
    const [rows] = await db.query('SELECT payer_id FROM payment_requests WHERE id = ?', [req.params.id]);
    if (rows.length === 0) return res.status(404).json({ message: 'طلب الدفع غير موجود' });

    await db.query(
      "UPDATE payment_requests SET status = 'rejected', admin_notes = ? WHERE id = ?",
      [req.body.notes || null, req.params.id]
    );

    await createNotification(
      rows[0].payer_id,
      'تم رفض طلب الدفع',
      `تم رفض طلب الدفع الخاص بك. ${req.body.notes ? `السبب: ${req.body.notes}` : 'يرجى مراجعة بيانات الدفع والمحاولة مرة أخرى.'}`
    );

    return res.json({ message: 'تم رفض طلب الدفع' });
  } catch (error) {
    console.error('Error rejecting payment:', error);
    return res.status(500).json({ message: 'حدث خطأ أثناء رفض طلب الدفع' });
  }
};

// ==================== CHAT MONITORING ====================

// @desc    List all conversations (admin monitoring)
// @route   GET /api/admin/conversations
// @access  Private/Admin
export const getAllConversations = async (req, res) => {
  try {
    const [rows] = await db.query(`
      SELECT c.*, s.name AS student_name, o.name AS owner_name, p.title AS property_title,
             (SELECT COUNT(*) FROM messages m WHERE m.conversation_id = c.id) AS message_count
      FROM conversations c
      JOIN users s ON c.student_id = s.id
      JOIN users o ON c.owner_id = o.id
      LEFT JOIN properties p ON c.property_id = p.id
      ORDER BY c.created_at DESC
    `);
    return res.json(rows);
  } catch (error) {
    console.error('Error fetching conversations for admin:', error);
    return res.status(500).json({ message: 'حدث خطأ أثناء جلب المحادثات' });
  }
};

// @desc    View all messages in a conversation (admin monitoring)
// @route   GET /api/admin/conversations/:id/messages
// @access  Private/Admin
export const getConversationMessages = async (req, res) => {
  try {
    const [rows] = await db.query(
      `SELECT m.*, u.name AS sender_name
       FROM messages m JOIN users u ON m.sender_id = u.id
       WHERE m.conversation_id = ?
       ORDER BY m.created_at ASC`,
      [req.params.id]
    );
    return res.json(rows);
  } catch (error) {
    console.error('Error fetching conversation messages for admin:', error);
    return res.status(500).json({ message: 'حدث خطأ أثناء جلب الرسائل' });
  }
};
