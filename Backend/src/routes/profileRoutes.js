import express from 'express';
import { protect } from '../middleware/authMiddleware.js';
import {
  getProfile,
  updateProfile,
  uploadProfileImage,
} from '../controllers/profileController.js';

const router = express.Router();

router.get('/', protect, getProfile);
router.put('/', protect, updateProfile);
router.post('/image', protect, uploadProfileImage);

export default router;
