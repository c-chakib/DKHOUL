import { Router } from 'express';
import {
  getAllUsers,
  getUserById,
  updateUserStatus,
  suspendUser,
  deleteUser,
  getAllServices,
  getPendingServices,
  updateServiceStatus,
  approveService,
  rejectService,
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
router.put('/users/:id/suspend', suspendUser);
router.delete('/users/:id', deleteUser);

// Service management
router.get('/services/pending', getPendingServices);
router.get('/services', getAllServices);
router.patch('/services/:id/status', updateServiceStatus);
router.put('/services/:id/approve', approveService);
router.put('/services/:id/reject', rejectService);
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

