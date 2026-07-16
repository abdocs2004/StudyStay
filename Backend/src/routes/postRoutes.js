import express from 'express';
import {
  createPost,
  getPosts,
  getStudentPosts,
  getPostById,
  updatePost,
  deletePost,
} from '../controllers/postController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/student/me', protect, getStudentPosts);
router.get('/:id', protect, getPostById);
router.put('/:id', protect, updatePost);
router.delete('/:id', protect, deletePost);
router.get('/', protect, getPosts);
router.post('/', protect, createPost);

export default router;
