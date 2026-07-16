import express from 'express';
import {
  createReview,
  getOwnerReviews,
  getPropertyReviews,
  getMyReviews,
  canReviewOwner,
} from '../controllers/reviewController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/mine', protect, getMyReviews);
router.get('/can-review/:ownerId', protect, canReviewOwner);
router.get('/owner/:ownerId', getOwnerReviews);
router.get('/property/:propertyId', getPropertyReviews);
router.post('/', protect, createReview);

export default router;
