import express from 'express';
import {
  getUserProfile,
  updateMyProfile,
  getMyProducts,
  getMyFavorites,
  addFavorite,
  removeFavorite,
} from '../controllers/userController.js';
import { protect } from '../middleware/authMiddleware.js';
import { uploadSingle } from '../middleware/uploadMiddleware.js';

const router = express.Router();

// Current user profile and favorites
router.patch('/me', protect, uploadSingle, updateMyProfile);
router.get('/me/products', protect, getMyProducts);
router.get('/me/favorites', protect, getMyFavorites);
router.post('/me/favorites/:productId', protect, addFavorite);
router.delete('/me/favorites/:productId', protect, removeFavorite);

// Public user profile
router.get('/:id', getUserProfile);

export default router;
