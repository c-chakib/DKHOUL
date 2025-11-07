import { Router } from 'express';
import {
  register,
  login,
  verifyEmail,
  forgotPassword,
  resetPassword,
  refreshToken,
  logout,
  getCurrentUser,
  googleAuth
} from '../controllers/auth.controller';
import { registerValidation, loginValidation } from '../utils/validators';
import { validate } from '../middleware/validation.middleware';
import { authenticate } from '../middleware/auth.middleware';

const router = Router();

// Public routes
router.post('/register', registerValidation, validate, register);
router.post('/login', loginValidation, validate, login);
router.post('/google', googleAuth); // Google OAuth login
router.get('/verify-email/:token', verifyEmail);
router.post('/forgot-password', forgotPassword);
router.post('/reset-password/:token', resetPassword);
router.post('/refresh', refreshToken); // Changed from /refresh-token to match test expectations
// Remove duplicate /refresh endpoint to keep one canonical path matching frontend tests

// Protected routes
router.post('/logout', authenticate, logout);
router.get('/me', authenticate, getCurrentUser);

export default router;

