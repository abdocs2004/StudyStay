import express from 'express';
import {
  getStats,
  getRecentActivity,
  getUsers,
  getUserProfile,
  suspendUser,
  activateUser,
  deleteUser,
  resetUserPassword,
  getAllProperties,
  approveProperty,
  rejectProperty,
  adminDeleteProperty,
  getAllPosts,
  approvePost,
  rejectPost,
  adminDeletePost,
  getAllPayments,
  approvePayment,
  rejectPayment,
  getAllConversations,
  getConversationMessages,
} from '../controllers/adminController.js';
import { protect } from '../middleware/authMiddleware.js';
import { adminOnly } from '../middleware/adminMiddleware.js';

const router = express.Router();

router.use(protect, adminOnly);

router.get('/stats', getStats);
router.get('/activity', getRecentActivity);

router.get('/users', getUsers);
router.get('/users/:id', getUserProfile);
router.post('/users/:id/suspend', suspendUser);
router.post('/users/:id/activate', activateUser);
router.post('/users/:id/reset-password', resetUserPassword);
router.delete('/users/:id', deleteUser);

router.get('/properties', getAllProperties);
router.post('/properties/:id/approve', approveProperty);
router.post('/properties/:id/reject', rejectProperty);
router.delete('/properties/:id', adminDeleteProperty);

router.get('/posts', getAllPosts);
router.post('/posts/:id/approve', approvePost);
router.post('/posts/:id/reject', rejectPost);
router.delete('/posts/:id', adminDeletePost);

router.get('/payments', getAllPayments);
router.post('/payments/:id/approve', approvePayment);
router.post('/payments/:id/reject', rejectPayment);

router.get('/conversations', getAllConversations);
router.get('/conversations/:id/messages', getConversationMessages);

export default router;
