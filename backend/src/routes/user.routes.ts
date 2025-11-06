import { Router } from 'express';
import {
  getProfile,
  getUserById,
  updateProfile,
  uploadProfilePhoto,
  deleteProfilePhoto,
  updateSettings,
  changePassword,
  deleteAccount,
  getUserStats,
  toggleVerification,
  getUserServices,
  getUserReviews
} from '../controllers/user.controller';
import { authenticate, authorize } from '../middleware/auth.middleware';
import { upload } from '../middleware/upload.middleware';

const router = Router();

// Authenticated user routes - MUST come before public /:id routes
router.get('/profile', authenticate, getProfile);
router.put('/profile', authenticate, updateProfile);
router.post('/photo', authenticate, upload.single('photo'), uploadProfilePhoto);
router.delete('/photo', authenticate, deleteProfilePhoto);
router.put('/settings', authenticate, updateSettings);
router.put('/password', authenticate, changePassword);
router.delete('/account', authenticate, deleteAccount);
router.get('/stats', authenticate, getUserStats);

// Public routes
router.get('/:id', getUserById);
router.get('/:id/services', getUserServices);
router.get('/:id/reviews', getUserReviews);

// Admin routes
router.patch('/:id/verify', authenticate, authorize('admin'), toggleVerification);

export default router;

