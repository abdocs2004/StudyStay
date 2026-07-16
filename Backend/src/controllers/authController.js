import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import db from '../config/db.js';

const generateToken = (id, email, role) => {
  return jwt.sign(
    { id, email, role },
    process.env.JWT_SECRET || 'studystaysecretjwtkey123!@#',
    { expiresIn: '30d' }
  );
};

// @desc    Register a new user
// @route   POST /api/auth/register
// @access  Public
export const registerUser = async (req, res) => {
  const { name, email, password, role, phone, university } = req.body;

  if (!name || !email || !password || !role) {
    return res.status(400).json({ message: 'الرجاء إدخال جميع البيانات المطلوبة' });
  }

  try {
    // Check if user exists
    const [existing] = await db.query('SELECT * FROM users WHERE email = ?', [email]);
    if (existing.length > 0) {
      return res.status(400).json({ message: 'البريد الإلكتروني مسجل بالفعل' });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Insert user
    const [result] = await db.query(
      'INSERT INTO users (name, email, password, role, phone, university) VALUES (?, ?, ?, ?, ?, ?)',
      [name, email, hashedPassword, role, phone || null, university || null]
    );

    const userId = result.insertId;
    const token = generateToken(userId, email, role);

    return res.status(201).json({
      token,
      user: {
        id: userId,
        name,
        email,
        role,
        phone: phone || null,
        university: university || null,
        bio: null,
        profile_image: null,
        verification_status: 'pending',
      },
    });
  } catch (error) {
    console.error('Registration error:', error);
    return res.status(500).json({ message: 'حدث خطأ في الخادم أثناء التسجيل' });
  }
};

// @desc    Authenticate user & get token
// @route   POST /api/auth/login
// @access  Public
export const loginUser = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: 'الرجاء إدخال البريد الإلكتروني وكلمة المرور' });
  }

  try {
    const [users] = await db.query('SELECT * FROM users WHERE email = ?', [email]);
    if (users.length === 0) {
      return res.status(401).json({ message: 'بيانات الاعتماد غير صالحة' });
    }

    const user = users[0];

    // Check password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'بيانات الاعتماد غير صالحة' });
    }

    if (user.role === 'admin') {
      return res.status(403).json({ message: 'حسابات الإدارة يجب تسجيل الدخول عبر لوحة التحكم الخاصة بها' });
    }

    if (user.is_suspended) {
      return res.status(403).json({ message: 'تم تعليق هذا الحساب. تواصل مع الإدارة لمزيد من التفاصيل.' });
    }

    const token = generateToken(user.id, user.email, user.role);

    return res.json({
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        phone: user.phone,
        university: user.university,
        bio: user.bio,
        profile_image: user.profile_image,
        verification_status: user.verification_status,
      },
    });
  } catch (error) {
    console.error('Login error:', error);
    return res.status(500).json({ message: 'حدث خطأ في الخادم أثناء تسجيل الدخول' });
  }
};

// @desc    Authenticate an admin & get token (separate from public login)
// @route   POST /api/auth/admin-login
// @access  Public
export const adminLoginUser = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: 'الرجاء إدخال البريد الإلكتروني وكلمة المرور' });
  }

  try {
    const [users] = await db.query('SELECT * FROM users WHERE email = ? AND role = ?', [email, 'admin']);
    if (users.length === 0) {
      return res.status(401).json({ message: 'بيانات الاعتماد غير صالحة' });
    }

    const admin = users[0];
    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'بيانات الاعتماد غير صالحة' });
    }

    const token = generateToken(admin.id, admin.email, admin.role);

    return res.json({
      token,
      user: {
        id: admin.id,
        name: admin.name,
        email: admin.email,
        role: admin.role,
      },
    });
  } catch (error) {
    console.error('Admin login error:', error);
    return res.status(500).json({ message: 'حدث خطأ في الخادم أثناء تسجيل الدخول' });
  }
};

// @desc    Get current user profile
// @route   GET /api/auth/me
// @access  Private
export const getMe = async (req, res) => {
  try {
    const [users] = await db.query(
      'SELECT id, name, email, role, phone, university, bio, profile_image, verification_status, created_at FROM users WHERE id = ?',
      [req.user.id]
    );

    if (users.length === 0) {
      return res.status(404).json({ message: 'المستخدم غير موجود' });
    }

    return res.json(users[0]);
  } catch (error) {
    console.error('Get profile error:', error);
    return res.status(500).json({ message: 'حدث خطأ في الخادم أثناء جلب الملف الشخصي' });
  }
};

// @desc    Get user info by ID
// @route   GET /api/auth/user/:id
// @access  Private
export const getUserById = async (req, res) => {
  const { id } = req.params;
  try {
    const [users] = await db.query(
      'SELECT id, name, email, role, phone, university, bio, profile_image FROM users WHERE id = ?',
      [id]
    );

    if (users.length === 0) {
      return res.status(404).json({ message: 'المستخدم غير موجود' });
    }

    return res.json(users[0]);
  } catch (error) {
    console.error('Get user error:', error);
    return res.status(500).json({ message: 'حدث خطأ في الخادم أثناء جلب تفاصيل المستخدم' });
  }
};
