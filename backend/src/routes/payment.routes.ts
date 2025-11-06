import { Router } from 'express';
import {
  createPaymentIntent,
  confirmPayment,
  confirmCashPayment,
  getPaymentById,
  getMyPayments,
  releasePayment,
  refundPayment,
  stripeWebhook
} from '../controllers/payment.controller';
import { authenticate, authorize } from '../middleware/auth.middleware';
import express from 'express';

const router = Router();

// Webhook route (must be before express.json() middleware)
router.post(
  '/webhook/stripe',
  express.raw({ type: 'application/json' }),
  stripeWebhook
);

// Protected routes
router.use(authenticate);

router.post('/create-intent', createPaymentIntent);
router.post('/confirm', confirmPayment);
router.get('/my-payments', getMyPayments);
router.post('/:id/confirm-cash', authorize('host', 'provider', 'admin'), confirmCashPayment);
router.post('/refund', refundPayment); // Support body-based refund
router.get('/:id', getPaymentById);

// Admin routes
router.post('/:id/release', authorize('admin'), releasePayment);
router.post('/:id/refund', authorize('admin'), refundPayment); // Also support param-based refund

export default router;

