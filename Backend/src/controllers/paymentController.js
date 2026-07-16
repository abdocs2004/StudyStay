import multer from 'multer';
import db from '../config/db.js';
import { uploadBufferToCloudinary } from '../config/cloudinary.js';

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    if (!file.mimetype.startsWith('image/')) {
      return cb(new Error('يجب أن يكون إيصال الدفع صورة (JPEG أو PNG أو WEBP)'));
    }
    cb(null, true);
  },
});

const VALID_METHODS = ['instapay', 'vodafone_cash', 'orange_cash', 'etisalat_cash'];
const COMMISSION_RATE = Number(process.env.PLATFORM_COMMISSION_RATE) || 0.025;

// Checks whether `payerId` has an admin-approved payment request unlocking
// `targetUserId`'s contact info. Unlock is permanent and per user-pair,
// independent of which property/post triggered the original request.
export const hasUnlock = async (payerId, targetUserId) => {
  if (!payerId || !targetUserId || payerId === targetUserId) return true; // never lock a user's own info
  const [rows] = await db.query(
    'SELECT id FROM payment_requests WHERE payer_id = ? AND target_user_id = ? AND status = ? LIMIT 1',
    [payerId, targetUserId, 'approved']
  );
  return rows.length > 0;
};

// @desc    Public payment config: platform receiving numbers + commission rate
// @route   GET /api/payments/config
// @access  Private
export const getPaymentConfig = async (req, res) => {
  return res.json({
    commissionRate: COMMISSION_RATE,
    methods: {
      vodafone_cash: { label: 'فودافون كاش', number: process.env.PLATFORM_VODAFONE_CASH_NUMBER || '' },
      etisalat_cash: { label: 'اتصالات كاش', number: process.env.PLATFORM_ETISALAT_CASH_NUMBER || '' },
      instapay: { label: 'إنستاباي', number: process.env.PLATFORM_INSTAPAY_HANDLE || '' },
    },
  });
};

// @desc    Submit a payment request to unlock another user's contact info
// @route   POST /api/payments
// @access  Private
export const createPaymentRequest = async (req, res) => {
  const uploadSingle = upload.single('payment_proof');

  uploadSingle(req, res, async (err) => {
    if (err) {
      console.error('Payment proof upload error:', err);
      return res.status(400).json({ message: err.message || 'حدث خطأ أثناء رفع إيصال الدفع' });
    }

    const {
      target_user_id,
      property_id,
      post_id,
      payment_method,
      amount,
      transaction_reference,
      sender_phone,
      base_rent,
    } = req.body;
    const payerId = req.user.id;

    if (!target_user_id || !payment_method) {
      return res.status(400).json({ message: 'الرجاء تحديد المستخدم المطلوب وطريقة الدفع' });
    }

    if (!VALID_METHODS.includes(payment_method)) {
      return res.status(400).json({ message: 'طريقة الدفع غير صحيحة' });
    }

    if (!sender_phone) {
      return res.status(400).json({ message: 'الرجاء إدخال رقم الهاتف الذي تم التحويل منه' });
    }

    if (!req.file) {
      return res.status(400).json({ message: 'الرجاء رفع صورة إيصال الدفع' });
    }

    if (Number(target_user_id) === payerId) {
      return res.status(400).json({ message: 'لا يمكنك إرسال طلب دفع لفتح بياناتك الخاصة' });
    }

    try {
      const alreadyUnlocked = await hasUnlock(payerId, Number(target_user_id));
      if (alreadyUnlocked) {
        return res.status(200).json({ message: 'بيانات التواصل مفتوحة بالفعل لهذا المستخدم' });
      }

      const { url: proofUrl, publicId: proofPublicId } = await uploadBufferToCloudinary(req.file.buffer, 'payments');

      // Commission is always computed server-side from the rent — never
      // trust a client-supplied amount for the actual charge.
      const rent = base_rent ? Number(base_rent) : null;
      const commissionAmount = rent ? Math.round(rent * COMMISSION_RATE * 100) / 100 : Number(amount) || 0;

      const [result] = await db.query(
        `INSERT INTO payment_requests
          (payer_id, target_user_id, property_id, post_id, payment_method, amount, transaction_reference,
           payment_proof, payment_proof_public_id, sender_phone, commission_rate, base_rent, status)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'pending')`,
        [
          payerId,
          target_user_id,
          property_id || null,
          post_id || null,
          payment_method,
          commissionAmount,
          transaction_reference || null,
          proofUrl,
          proofPublicId,
          sender_phone,
          COMMISSION_RATE,
          rent,
        ]
      );

      const [rows] = await db.query('SELECT * FROM payment_requests WHERE id = ?', [result.insertId]);
      return res.status(201).json(rows[0]);
    } catch (error) {
      console.error('Error creating payment request:', error);
      return res.status(500).json({ message: 'حدث خطأ أثناء إرسال طلب الدفع' });
    }
  });
};

// @desc    Get the current user's own payment requests (to track status)
// @route   GET /api/payments/mine
// @access  Private
export const getMyPaymentRequests = async (req, res) => {
  try {
    const [rows] = await db.query(
      `SELECT pr.*, u.name AS target_name
       FROM payment_requests pr
       JOIN users u ON pr.target_user_id = u.id
       WHERE pr.payer_id = ?
       ORDER BY pr.created_at DESC`,
      [req.user.id]
    );
    return res.json(rows);
  } catch (error) {
    console.error('Error fetching payment requests:', error);
    return res.status(500).json({ message: 'حدث خطأ أثناء جلب طلبات الدفع' });
  }
};

// @desc    Check whether the current user has unlocked a target user's contact info
// @route   GET /api/payments/unlock-status?targetUserId=123
// @access  Private
export const getUnlockStatus = async (req, res) => {
  const { targetUserId } = req.query;

  if (!targetUserId) {
    return res.status(400).json({ message: 'targetUserId مطلوب' });
  }

  try {
    const unlocked = await hasUnlock(req.user.id, Number(targetUserId));
    return res.json({ unlocked });
  } catch (error) {
    console.error('Error checking unlock status:', error);
    return res.status(500).json({ message: 'حدث خطأ أثناء التحقق من حالة الفتح' });
  }
};
