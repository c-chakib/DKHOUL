import { Router } from 'express';
import {
  getProfile,
  getUserById,
  updateProfile,
  uploadProfilePhoto,
  changePassword,
  deleteAccount,
  getUserStats,
  toggleVerification
} from '../controllers/user.controller';
import { authenticate, authorize } from '../middleware/auth.middleware';
import { upload } from '../middleware/upload.middleware';

const router = Router();

// Public routes
router.get('/:id', getUserById);

// Protected routes
router.use(authenticate);

router.get('/me/profile', getProfile);
router.put('/me/profile', updateProfile);
router.post('/me/photo', upload.single('photo'), uploadProfilePhoto);
router.put('/me/password', changePassword);
router.delete('/me/account', deleteAccount);
router.get('/me/stats', getUserStats);

// Admin routes
router.patch('/:id/verify', authorize('admin'), toggleVerification);

export default router;

