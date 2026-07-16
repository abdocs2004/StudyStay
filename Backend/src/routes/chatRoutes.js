import express from 'express';
import {
  getConversations,
  getConversationById,
  getMessages,
  markMessagesRead,
  sendMessage,
  getOrCreateConversation,
} from '../controllers/chatController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/', protect, getConversations);
router.get('/:id', protect, getConversationById);
router.post('/conversations', protect, getOrCreateConversation);
router.get('/messages/:conversationId', protect, getMessages);
router.post('/messages/read/:conversationId', protect, markMessagesRead);
router.post('/', protect, sendMessage);

export default router;
