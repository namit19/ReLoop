import express from 'express';
import {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  updateProductStatus,
} from '../controllers/productController.js';
import { protect, optionalAuth } from '../middleware/authMiddleware.js';
import { uploadMultiple } from '../middleware/uploadMiddleware.js';

const router = express.Router();

router.route('/')
  .get(optionalAuth, getProducts)
  .post(protect, uploadMultiple, createProduct);

router.route('/:id')
  .get(optionalAuth, getProductById)
  .patch(protect, uploadMultiple, updateProduct)
  .delete(protect, deleteProduct);

router.patch('/:id/status', protect, updateProductStatus);

export default router;
