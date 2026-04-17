import express from 'express';
import { addProduct, updateProduct, deleteProduct, getAllProductsAdmin } from '../controllers/adminController.js';
import { authMiddleware, adminMiddleware } from '../middleware/authMiddleware.js';
import { validateProduct } from '../middleware/validationMiddleware.js';
import { upload } from '../middleware/uploadMiddleware.js';

const router = express.Router();

// Get all products (admin view)
router.get('/products', authMiddleware, adminMiddleware, getAllProductsAdmin);

// Add product
router.post('/products', authMiddleware, adminMiddleware, upload.single('image'), validateProduct, addProduct);

// Update product
router.put('/products/:id', authMiddleware, adminMiddleware, upload.single('image'), validateProduct, updateProduct);

// Delete product
router.delete('/products/:id', authMiddleware, adminMiddleware, deleteProduct);

export default router;
