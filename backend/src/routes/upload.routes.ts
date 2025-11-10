import { Router } from 'express';
import { uploadSingleImage, uploadMultipleImages } from '../controllers/upload.controller';
import { authenticate } from '../middleware/auth.middleware';
import { upload } from '../middleware/upload.middleware';

const router = Router();

// All routes are protected
router.use(authenticate);

// Upload single image
router.post('/image', upload.single('file'), uploadSingleImage);

// Upload multiple images
router.post('/multiple', upload.array('files', 10), uploadMultipleImages);

export default router;
