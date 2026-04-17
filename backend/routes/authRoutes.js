import express from 'express';
import { registerUser, loginUser, getUserProfile, updateUserProfile } from '../controllers/authController.js';
import { authMiddleware } from '../middleware/authMiddleware.js';

const router = express.Router();

// Register
router.post('/register', registerUser);

// Login
router.post('/login', loginUser);

// Get profile
router.get('/profile', authMiddleware, getUserProfile);

// Update profile
router.put('/profile', authMiddleware, updateUserProfile);

export default router;
