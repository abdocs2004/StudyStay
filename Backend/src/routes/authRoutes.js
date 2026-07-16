import express from 'express';
import { registerUser, loginUser, adminLoginUser, getMe, getUserById } from '../controllers/authController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/register', registerUser);
router.post('/login', loginUser);
router.post('/admin-login', adminLoginUser);
router.get('/me', protect, getMe);
router.get('/user/:id', protect, getUserById);

export default router;
