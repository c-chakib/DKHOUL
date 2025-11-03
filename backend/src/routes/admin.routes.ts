import { Router } from 'express';
import {
  getAllUsers,
  getUserById,
  updateUserStatus,
  deleteUser,
  getAllServices,
  updateServiceStatus,
  deleteService,
  getAllBookings,
  getAllPayments,
  getPlatformStats,
  deleteReview
} from '../controllers/admin.controller';
import { authenticate, authorize } from '../middleware/auth.middleware';

const router = Router();

// All routes are admin-only
router.use(authenticate, authorize('admin'));

// User management
router.get('/users', getAllUsers);
router.get('/users/:id', getUserById);
router.patch('/users/:id/status', updateUserStatus);
router.delete('/users/:id', deleteUser);

// Service management
router.get('/services', getAllServices);
router.patch('/services/:id/status', updateServiceStatus);
router.delete('/services/:id', deleteService);

// Booking management
router.get('/bookings', getAllBookings);

// Payment management
router.get('/payments', getAllPayments);

// Review management
router.delete('/reviews/:id', deleteReview);

// Platform statistics
router.get('/stats', getPlatformStats);

export default router;

