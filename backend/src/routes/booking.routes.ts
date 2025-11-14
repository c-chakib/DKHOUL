import { Router } from 'express';
import {
  createBooking,
  getMyBookings,
  getProviderBookings,
  getBookingById,
  updateBookingStatus,
  cancelBooking,
  getBookingStats
} from '../controllers/booking.controller';
import { authenticate, authorize } from '../middleware/auth.middleware';
import { createBookingValidation, updateBookingStatusValidation, cancelBookingValidation, adminActionValidation } from '../utils/validationRules';
import { validate, sanitizeInput } from '../middleware/validation.middleware';

const router = Router();

// All routes are protected
router.use(authenticate);

// User bookings (specific routes BEFORE dynamic :id route)
router.post('/', sanitizeInput, createBookingValidation, validate, createBooking);
router.get('/my', sanitizeInput, getMyBookings);
router.get('/provider-bookings', authorize('provider', 'admin'), sanitizeInput, getProviderBookings);
router.get('/stats', authorize('provider', 'admin'), sanitizeInput, getBookingStats);

// Dynamic route (must come AFTER specific routes)
router.get('/:id', sanitizeInput, getBookingById);

// Provider actions
router.patch(
  '/:id/status',
  authorize('provider', 'host', 'admin'),
  sanitizeInput,
  updateBookingStatusValidation,
  validate,
  updateBookingStatus
);

// User actions
router.post('/:id/cancel', sanitizeInput, cancelBookingValidation, validate, cancelBooking);

export default router;

