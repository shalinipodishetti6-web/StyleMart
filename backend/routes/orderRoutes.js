import express from 'express';
import { createOrder, getUserOrders, getOrderById, updateOrderStatus, getAllOrders } from '../controllers/orderController.js';
import { authMiddleware, adminMiddleware } from '../middleware/authMiddleware.js';
import { validateOrderDetails } from '../middleware/validationMiddleware.js';

const router = express.Router();

// Create order (user must be logged in)
router.post('/', authMiddleware, validateOrderDetails, createOrder);

// Get user's orders
router.get('/user-orders', authMiddleware, getUserOrders);

// Get order by ID
router.get('/:id', authMiddleware, getOrderById);

// Update order status (admin only)
router.put('/:id', authMiddleware, adminMiddleware, updateOrderStatus);

// Get all orders (admin only)
router.get('/', authMiddleware, adminMiddleware, getAllOrders);

export default router;
