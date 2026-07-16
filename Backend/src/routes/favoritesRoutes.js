import express from 'express';
import {
  getFavoriteProperties,
  addFavoriteProperty,
  removeFavoriteProperty,
  getFavoritePosts,
  addFavoritePost,
  removeFavoritePost,
} from '../controllers/favoritesController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/properties', protect, getFavoriteProperties);
router.post('/property/:propertyId', protect, addFavoriteProperty);
router.delete('/property/:propertyId', protect, removeFavoriteProperty);

router.get('/posts', protect, getFavoritePosts);
router.post('/post/:postId', protect, addFavoritePost);
router.delete('/post/:postId', protect, removeFavoritePost);

export default router;
