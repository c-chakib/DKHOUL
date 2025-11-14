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
import { createPaymentIntentValidation } from '../utils/validationRules';
import { validate, sanitizeInput } from '../middleware/validation.middleware';
import express from 'express';

const router = Router();

// Stripe webhook removed for now (no Stripe integration)

// Protected routes
router.use(authenticate);

router.post('/create-intent', sanitizeInput, createPaymentIntentValidation, validate, createPaymentIntent);
router.post('/confirm', sanitizeInput, validate, confirmPayment);
router.get('/my-payments', getMyPayments); // Must come before /:id
router.get('/my', getMyPayments); // Alias for backward compatibility
router.post('/refund', sanitizeInput, validate, refundPayment); // Support body-based refund
router.post('/:id/confirm-cash', authorize('host', 'provider', 'admin'), sanitizeInput, validate, confirmCashPayment);
router.get('/:id', getPaymentById); // Parametric route must come after specific routes

// Admin routes
router.post('/:id/release', authorize('admin'), releasePayment);
router.post('/:id/refund', authorize('admin'), refundPayment); // Also support param-based refund

export default router;

