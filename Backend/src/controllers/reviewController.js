import db from '../config/db.js';
import { hasUnlock } from './paymentController.js';
import { createNotification } from './notificationController.js';

// @desc    Submit a review for an owner (students only, after contact unlock)
// @route   POST /api/reviews
// @access  Private (Student)
export const createReview = async (req, res) => {
  const { id: studentId, role } = req.user;
  const { owner_id, property_id, rating, comment } = req.body;

  if (role !== 'student') {
    return res.status(403).json({ message: 'الطلاب فقط يمكنهم تقييم الملاك' });
  }

  const ratingNumber = Number(rating);
  if (!owner_id || !ratingNumber || ratingNumber < 1 || ratingNumber > 5) {
    return res.status(400).json({ message: 'الرجاء إدخال تقييم صحيح (1-5) وتحديد المالك' });
  }

  try {
    const unlocked = (await hasUnlock(studentId, Number(owner_id))) || (await hasUnlock(Number(owner_id), studentId));
    if (!unlocked) {
      return res.status(403).json({ message: 'يمكنك تقييم المالك فقط بعد فتح بيانات التواصل معه' });
    }

    const [result] = await db.query(
      'INSERT INTO reviews (student_id, owner_id, property_id, rating, comment) VALUES (?, ?, ?, ?, ?)',
      [studentId, owner_id, property_id || null, ratingNumber, comment || null]
    );

    const [rows] = await db.query(
      `SELECT r.*, s.name AS student_name FROM reviews r JOIN users s ON r.student_id = s.id WHERE r.id = ?`,
      [result.insertId]
    );

    await createNotification(Number(owner_id), 'تقييم جديد', `أضاف أحد الطلاب تقييماً جديداً (${ratingNumber}/5) لملفك.`);

    return res.status(201).json(rows[0]);
  } catch (error) {
    if (error.code === 'ER_DUP_ENTRY') {
      return res.status(409).json({ message: 'لقد قمت بتقييم هذا المالك من قبل' });
    }
    console.error('Error creating review:', error);
    return res.status(500).json({ message: 'حدث خطأ أثناء إرسال التقييم' });
  }
};

// @desc    Get all reviews + aggregate rating for an owner
// @route   GET /api/reviews/owner/:ownerId
// @access  Public
export const getOwnerReviews = async (req, res) => {
  const { ownerId } = req.params;

  try {
    const [reviews] = await db.query(
      `SELECT r.*, s.name AS student_name FROM reviews r
       JOIN users s ON r.student_id = s.id
       WHERE r.owner_id = ?
       ORDER BY r.created_at DESC`,
      [ownerId]
    );

    const totalReviews = reviews.length;
    const averageRating =
      totalReviews > 0 ? Math.round((reviews.reduce((sum, r) => sum + r.rating, 0) / totalReviews) * 10) / 10 : 0;

    return res.json({ reviews, averageRating, totalReviews });
  } catch (error) {
    console.error('Error fetching owner reviews:', error);
    return res.status(500).json({ message: 'حدث خطأ أثناء جلب التقييمات' });
  }
};

// @desc    Get reviews tied specifically to a property
// @route   GET /api/reviews/property/:propertyId
// @access  Public
export const getPropertyReviews = async (req, res) => {
  const { propertyId } = req.params;

  try {
    const [reviews] = await db.query(
      `SELECT r.*, s.name AS student_name FROM reviews r
       JOIN users s ON r.student_id = s.id
       WHERE r.property_id = ?
       ORDER BY r.created_at DESC`,
      [propertyId]
    );

    const totalReviews = reviews.length;
    const averageRating =
      totalReviews > 0 ? Math.round((reviews.reduce((sum, r) => sum + r.rating, 0) / totalReviews) * 10) / 10 : 0;

    return res.json({ reviews, averageRating, totalReviews });
  } catch (error) {
    console.error('Error fetching property reviews:', error);
    return res.status(500).json({ message: 'حدث خطأ أثناء جلب تقييمات العقار' });
  }
};

// @desc    Get the current student's own written reviews
// @route   GET /api/reviews/mine
// @access  Private (Student)
export const getMyReviews = async (req, res) => {
  try {
    const [rows] = await db.query(
      `SELECT r.*, o.name AS owner_name FROM reviews r JOIN users o ON r.owner_id = o.id WHERE r.student_id = ? ORDER BY r.created_at DESC`,
      [req.user.id]
    );
    return res.json(rows);
  } catch (error) {
    console.error('Error fetching my reviews:', error);
    return res.status(500).json({ message: 'حدث خطأ أثناء جلب تقييماتك' });
  }
};

// @desc    Check whether the current student can review a given owner
// @route   GET /api/reviews/can-review/:ownerId
// @access  Private (Student)
export const canReviewOwner = async (req, res) => {
  const { ownerId } = req.params;
  const studentId = req.user.id;

  try {
    const unlocked =
      (await hasUnlock(studentId, Number(ownerId))) || (await hasUnlock(Number(ownerId), studentId));
    const [existing] = await db.query('SELECT id FROM reviews WHERE student_id = ? AND owner_id = ?', [
      studentId,
      ownerId,
    ]);

    return res.json({ canReview: unlocked && existing.length === 0, alreadyReviewed: existing.length > 0, unlocked });
  } catch (error) {
    console.error('Error checking review eligibility:', error);
    return res.status(500).json({ message: 'حدث خطأ أثناء التحقق من إمكانية التقييم' });
  }
};
