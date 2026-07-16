import db from '../config/db.js';
import { createNotification } from './notificationController.js';

const getFavoriteProperties = async (req, res) => {
  const { role, id: userId } = req.user;
  if (role !== 'student' && role !== 'admin') {
    return res.status(403).json({ message: 'غير مصرح، فقط الطلاب يمكنهم مشاهدة المفضلة' });
  }

  try {
    const [rows] = await db.query(
      `SELECT p.*
       FROM favorites f
       JOIN properties p ON f.property_id = p.id
       WHERE f.user_id = ? AND f.property_id IS NOT NULL`
      , [userId]
    );
    return res.json(rows);
  } catch (error) {
    console.error('Error fetching favorite properties:', error);
    return res.status(500).json({ message: 'حدث خطأ أثناء جلب المفضلات' });
  }
};

const addFavoriteProperty = async (req, res) => {
  const { role, id: userId } = req.user;
  const { propertyId } = req.params;

  if (role !== 'student' && role !== 'admin') {
    return res.status(403).json({ message: 'غير مصرح، فقط الطلاب يمكنهم حفظ العقارات' });
  }

  try {
    const [existingProperty] = await db.query('SELECT id, owner_id, title FROM properties WHERE id = ?', [propertyId]);
    if (existingProperty.length === 0) {
      return res.status(404).json({ message: 'العقار غير موجود' });
    }

    const [existingFavorite] = await db.query(
      'SELECT id FROM favorites WHERE user_id = ? AND property_id = ? AND post_id IS NULL',
      [userId, propertyId]
    );

    if (existingFavorite.length > 0) {
      return res.status(200).json({ message: 'هذا العقار موجود بالفعل في المفضلة' });
    }

    await db.query(
      'INSERT INTO favorites (user_id, property_id, post_id) VALUES (?, ?, NULL)',
      [userId, propertyId]
    );

    const property = existingProperty[0];
    if (property.owner_id !== userId) {
      await createNotification(
        property.owner_id,
        'إعجاب جديد بعقارك',
        `أضاف أحد الطلاب عقارك "${property.title}" إلى المفضلة.`
      );
    }

    return res.status(201).json({ message: 'تم حفظ العقار في المفضلة' });
  } catch (error) {
    console.error('Error adding favorite property:', error);
    return res.status(500).json({ message: 'حدث خطأ أثناء حفظ العقار' });
  }
};

const removeFavoriteProperty = async (req, res) => {
  const { role, id: userId } = req.user;
  const { propertyId } = req.params;

  if (role !== 'student' && role !== 'admin') {
    return res.status(403).json({ message: 'غير مصرح، فقط الطلاب يمكنهم حذف العقارات من المفضلة' });
  }

  try {
    await db.query('DELETE FROM favorites WHERE user_id = ? AND property_id = ? AND post_id IS NULL', [userId, propertyId]);
    return res.json({ message: 'تمت إزالة العقار من المفضلة' });
  } catch (error) {
    console.error('Error removing favorite property:', error);
    return res.status(500).json({ message: 'حدث خطأ أثناء إزالة العقار من المفضلة' });
  }
};

const getFavoritePosts = async (req, res) => {
  const { role, id: userId } = req.user;
  if (role !== 'owner' && role !== 'admin') {
    return res.status(403).json({ message: 'غير مصرح، فقط الملاك يمكنهم مشاهدة الطلبات المحفوظة' });
  }

  try {
    const [rows] = await db.query(
      `SELECT po.*, u.name as student_name, u.email as student_email, u.phone as student_phone, u.university as student_university, p.title as property_title, p.city as property_city
       FROM favorites f
       JOIN posts po ON f.post_id = po.id
       JOIN users u ON po.student_id = u.id
       LEFT JOIN properties p ON po.property_id = p.id
       WHERE f.user_id = ? AND f.post_id IS NOT NULL
       ORDER BY f.created_at DESC`
      , [userId]
    );
    return res.json(rows);
  } catch (error) {
    console.error('Error fetching favorite posts:', error);
    return res.status(500).json({ message: 'حدث خطأ أثناء جلب الطلبات المحفوظة' });
  }
};

const addFavoritePost = async (req, res) => {
  const { role, id: userId } = req.user;
  const { postId } = req.params;

  if (role !== 'owner' && role !== 'admin') {
    return res.status(403).json({ message: 'غير مصرح، فقط الملاك يمكنهم حفظ الطلبات' });
  }

  try {
    const [existingPost] = await db.query('SELECT id, student_id FROM posts WHERE id = ?', [postId]);
    if (existingPost.length === 0) {
      return res.status(404).json({ message: 'الطلب غير موجود' });
    }

    const [existingFavorite] = await db.query(
      'SELECT id FROM favorites WHERE user_id = ? AND post_id = ? AND property_id IS NULL',
      [userId, postId]
    );

    if (existingFavorite.length > 0) {
      return res.status(200).json({ message: 'هذا الطلب موجود بالفعل في المفضلة' });
    }

    await db.query(
      'INSERT INTO favorites (user_id, property_id, post_id) VALUES (?, NULL, ?)',
      [userId, postId]
    );

    const post = existingPost[0];
    if (post.student_id !== userId) {
      await createNotification(
        post.student_id,
        'إعجاب مالك بطلبك',
        'أضاف أحد الملاك طلب السكن الخاص بك إلى المفضلة، وقد يتواصل معك قريباً.'
      );
    }

    return res.status(201).json({ message: 'تم حفظ الطلب في المفضلة' });
  } catch (error) {
    console.error('Error adding favorite post:', error);
    return res.status(500).json({ message: 'حدث خطأ أثناء حفظ الطلب' });
  }
};

const removeFavoritePost = async (req, res) => {
  const { role, id: userId } = req.user;
  const { postId } = req.params;

  if (role !== 'owner' && role !== 'admin') {
    return res.status(403).json({ message: 'غير مصرح، فقط الملاك يمكنهم حذف الطلبات من المفضلة' });
  }

  try {
    await db.query('DELETE FROM favorites WHERE user_id = ? AND post_id = ? AND property_id IS NULL', [userId, postId]);
    return res.json({ message: 'تمت إزالة الطلب من المفضلة' });
  } catch (error) {
    console.error('Error removing favorite post:', error);
    return res.status(500).json({ message: 'حدث خطأ أثناء إزالة الطلب من المفضلة' });
  }
};

export {
  getFavoriteProperties,
  addFavoriteProperty,
  removeFavoriteProperty,
  getFavoritePosts,
  addFavoritePost,
  removeFavoritePost,
};
