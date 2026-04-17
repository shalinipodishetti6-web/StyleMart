import express from 'express';
import { getAllProducts, searchProducts, getProductById, getProductsByCategory, getTrendingProducts } from '../controllers/productController.js';

const router = express.Router();

// Get all products
router.get('/', getAllProducts);

// Search products
router.get('/search', searchProducts);

// Get trending products
router.get('/trending', getTrendingProducts);

// Get products by category
router.get('/category/:category', getProductsByCategory);

// Get product by ID
router.get('/:id', getProductById);

export default router;
