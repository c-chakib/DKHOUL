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
import { bookingValidation } from '../utils/validators';
import { validate } from '../middleware/validation.middleware';

const router = Router();

// All routes are protected
router.use(authenticate);

// User bookings
router.post('/', bookingValidation, validate, createBooking);
router.get('/my-bookings', getMyBookings);
router.get('/provider-bookings', authorize('provider', 'admin'), getProviderBookings);
router.get('/stats', authorize('provider', 'admin'), getBookingStats);
router.get('/:id', getBookingById);

// Provider actions
router.patch(
  '/:id/status',
  authorize('provider', 'admin'),
  updateBookingStatus
);

// User actions
router.patch('/:id/cancel', cancelBooking);

export default router;

