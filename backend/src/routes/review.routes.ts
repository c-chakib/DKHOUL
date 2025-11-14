import { Router } from 'express';
import {
  createReview,
  getServiceReviews,
  getReviewById,
  updateReview,
  deleteReview,
  respondToReview
} from '../controllers/review.controller';
import { authenticate, authorize } from '../middleware/auth.middleware';
import { createReviewValidation } from '../utils/validationRules';

const router = Router();

// Public routes
router.get('/service/:serviceId', getServiceReviews);
router.get('/:id', getReviewById);

// Protected routes
router.use(authenticate);

import { validate, sanitizeInput } from '../middleware/validation.middleware';
router.post('/', sanitizeInput, createReviewValidation, validate, createReview);
router.put('/:id', updateReview);
router.delete('/:id', deleteReview);
router.post('/:id/respond', respondToReview);

export default router;

