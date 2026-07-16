import express from 'express';
import {
  getProperties,
  getPropertyById,
  createProperty,
  updateProperty,
  deleteProperty,
  getOwnerProperties,
  getOwnerStats,
  uploadPropertyImages,
  deletePropertyImage,
} from '../controllers/propertyController.js';
import { protect, optionalAuth } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/', optionalAuth, getProperties);
router.get('/owner/me', protect, getOwnerProperties);
router.get('/owner/stats', protect, getOwnerStats);
router.get('/:id', optionalAuth, getPropertyById);
router.post('/', protect, createProperty);
router.put('/:id', protect, updateProperty);
router.delete('/:id', protect, deleteProperty);
router.post('/:id/images', protect, uploadPropertyImages);
router.delete('/:id/images/:imageId', protect, deletePropertyImage);

export default router;
