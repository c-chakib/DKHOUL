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
import { reviewValidation } from '../utils/validators';
import { validate } from '../middleware/validation.middleware';

const router = Router();

// Public routes
router.get('/service/:serviceId', getServiceReviews);
router.get('/:id', getReviewById);

// Protected routes
router.use(authenticate);

router.post('/', reviewValidation, validate, createReview);
router.put('/:id', updateReview);
router.delete('/:id', deleteReview);
router.post('/:id/respond', authorize('provider'), respondToReview);

export default router;

