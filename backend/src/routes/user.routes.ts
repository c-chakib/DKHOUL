import { Router } from 'express';
import {
  getAllUsers,
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
import {
  updateProfileValidation,
  changePasswordValidation,
  adminActionValidation
} from '../utils/validationRules';
import { validate, sanitizeInput } from '../middleware/validation.middleware';

const router = Router();

// Authenticated user routes - MUST come before public /:id routes
router.get('/', authenticate, getAllUsers);
router.get('/profile', authenticate, getProfile);
router.put('/profile', authenticate, sanitizeInput, updateProfileValidation, validate, updateProfile);
router.post('/photo', authenticate, upload.single('photo'), uploadProfilePhoto);
router.delete('/photo', authenticate, deleteProfilePhoto);
router.put('/settings', authenticate, sanitizeInput, updateSettings);
router.put('/password', authenticate, sanitizeInput, changePasswordValidation, validate, changePassword);
router.delete('/account', authenticate, deleteAccount);
router.get('/stats', authenticate, getUserStats);

// Public routes
router.get('/:id', sanitizeInput, getUserById);
router.get('/:id/services', sanitizeInput, getUserServices);
router.get('/:id/reviews', sanitizeInput, getUserReviews);

// Admin routes
router.patch('/:id/verify', authenticate, authorize('admin'), sanitizeInput, adminActionValidation, validate, toggleVerification);

export default router;

