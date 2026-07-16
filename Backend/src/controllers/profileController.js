import multer from 'multer';
import db from '../config/db.js';
import { uploadBufferToCloudinary, deleteFromCloudinary } from '../config/cloudinary.js';

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    if (!file.mimetype.startsWith('image/')) {
      return cb(new Error('يجب أن تكون الصورة من نوع JPEG أو PNG أو GIF أو WEBP')); 
    }
    cb(null, true);
  },
});

export const getProfile = async (req, res) => {
  try {
    const [rows] = await db.query(
      'SELECT id, name, email, role, phone, university, bio, profile_image, created_at FROM users WHERE id = ?',
      [req.user.id]
    );
    if (rows.length === 0) {
      return res.status(404).json({ message: 'المستخدم غير موجود' });
    }
    return res.json(rows[0]);
  } catch (error) {
    console.error('Error fetching profile:', error);
    return res.status(500).json({ message: 'حدث خطأ أثناء جلب الملف الشخصي' });
  }
};

export const updateProfile = async (req, res) => {
  const { name, phone, university, bio } = req.body;
  const { id: userId } = req.user;

  if (!name || !phone) {
    return res.status(400).json({ message: 'الاسم ورقم الهاتف مطلوبان' });
  }

  try {
    const updates = [];
    const params = [];

    updates.push('name = ?');
    params.push(name.trim());

    updates.push('phone = ?');
    params.push(phone.trim());

    if (req.user.role === 'student') {
      updates.push('university = ?');
      params.push(university ? university.trim() : null);
    }

    updates.push('bio = ?');
    params.push(bio ? bio.trim() : null);

    params.push(userId);

    await db.query(`UPDATE users SET ${updates.join(', ')} WHERE id = ?`, params);

    const [rows] = await db.query(
      'SELECT id, name, email, role, phone, university, bio, profile_image, created_at FROM users WHERE id = ?',
      [userId]
    );

    return res.json(rows[0]);
  } catch (error) {
    console.error('Error updating profile:', error);
    return res.status(500).json({ message: 'حدث خطأ أثناء تحديث الملف الشخصي' });
  }
};

export const uploadProfileImage = async (req, res) => {
  const uploadSingle = upload.single('profile_image');

  uploadSingle(req, res, async (err) => {
    if (err) {
      console.error('Image upload error:', err);
      return res.status(400).json({ message: err.message || 'حدث خطأ أثناء رفع الصورة' });
    }

    if (!req.file) {
      return res.status(400).json({ message: 'الرجاء إرفاق صورة صحيحة' });
    }

    try {
      const [existingRows] = await db.query('SELECT profile_image_public_id FROM users WHERE id = ?', [req.user.id]);
      const previousPublicId = existingRows[0]?.profile_image_public_id;

      const { url, publicId } = await uploadBufferToCloudinary(req.file.buffer, 'profiles');

      await db.query('UPDATE users SET profile_image = ?, profile_image_public_id = ? WHERE id = ?', [
        url,
        publicId,
        req.user.id,
      ]);

      // Clean up the old image only after the new one is confirmed saved.
      await deleteFromCloudinary(previousPublicId);

      const [rows] = await db.query(
        'SELECT id, name, email, role, phone, university, bio, profile_image, created_at FROM users WHERE id = ?',
        [req.user.id]
      );
      return res.json(rows[0]);
    } catch (error) {
      console.error('Error saving profile image:', error);
      return res.status(500).json({ message: 'حدث خطأ أثناء حفظ الصورة' });
    }
  });
};
