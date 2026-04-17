import express from 'express';
import { upload } from '../middleware/uploadMiddleware.js';
import { processVirtualTryOn, generateCustomDesign } from '../controllers/aiController.js';

const router = express.Router();

// Virtual Try-On endpoint - with image upload
router.post('/tryon', upload.single('image'), processVirtualTryOn);

// Custom Design endpoint - no file upload needed
router.post('/customize', generateCustomDesign);

export default router;
