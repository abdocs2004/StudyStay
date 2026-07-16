import express from 'express';
import { createPaymentRequest, getMyPaymentRequests, getUnlockStatus, getPaymentConfig } from '../controllers/paymentController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/config', protect, getPaymentConfig);
router.get('/mine', protect, getMyPaymentRequests);
router.get('/unlock-status', protect, getUnlockStatus);
router.post('/', protect, createPaymentRequest);

export default router;
