import express from 'express';
import {
  getNotifications,
  getUnreadCount,
  markNotificationRead,
  markAllNotificationsRead,
  deleteNotification,
} from '../controllers/notificationController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/', protect, getNotifications);
router.get('/unread-count', protect, getUnreadCount);
router.post('/read-all', protect, markAllNotificationsRead);
router.post('/:id/read', protect, markNotificationRead);
router.delete('/:id', protect, deleteNotification);

export default router;
