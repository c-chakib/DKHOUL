import { Request, Response, NextFunction } from 'express';
import Payment from '../models/Payment.model';
import Booking from '../models/Booking.model';
import { AppError } from '../middleware/error.middleware';
import { getObjectIdString } from '../utils/helpers';

// Mock Stripe for demonstration - Replace with real Stripe when configured
const mockStripe = {
  paymentIntents: {
    create: async (params: any) => ({
      id: `pi_mock_${Date.now()}`,
      client_secret: `pi_mock_${Date.now()}_secret_${Math.random().toString(36).substring(7)}`,
      amount: params.amount,
      currency: params.currency,
      status: 'requires_payment_method',
      metadata: params.metadata
    }),
    retrieve: async (id: string) => ({
      id,
      status: 'succeeded',
      amount: 10000,
      currency: 'mad'
    })
  },
  refunds: {
    create: async (params: any) => ({
      id: `re_mock_${Date.now()}`,
      payment_intent: params.payment_intent,
      amount: params.amount,
      status: 'succeeded'
    })
  }
};

// Create payment intent (supports multiple payment methods)
export const createPaymentIntent = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = (req as any).user.userId;
    const { bookingId, paymentMethod = 'mock' } = req.body; // mock, cash, stripe

    // Get booking
    const booking = await Booking.findById(bookingId);
    if (!booking) {
      return next(new AppError('Booking not found', 404));
    }

    // Check authorization
    if (getObjectIdString(booking.touristId) !== userId) {
      return next(new AppError('Not authorized to pay for this booking', 403));
    }

    // Check if already paid
    const existingPayment = await Payment.findOne({ bookingId });
    if (existingPayment && existingPayment.status === 'completed') {
      return next(new AppError('Booking already paid', 400));
    }

    let payment;
    let paymentIntent: any = null;

    // Handle different payment methods
    if (paymentMethod === 'cash') {
      // Cash on Delivery - No online payment needed
      payment = await Payment.create({
        bookingId,
        amount: booking.totalAmount || booking.pricing.totalAmount,
        currency: 'MAD',
        paymentMethod: 'cash',
        status: 'pending', // Will be confirmed by host when cash is received
        escrowStatus: 'not_applicable',
        notes: 'Payment to be made in cash directly to host'
      });

      // Update booking status
      await Booking.findByIdAndUpdate(bookingId, {
        status: 'confirmed',
        paymentId: payment._id
      });

      res.status(201).json({
        success: true,
        message: 'Booking confirmed! Please pay in cash to the host.',
        data: {
          payment,
          paymentMethod: 'cash'
        }
      });

    } else if (paymentMethod === 'mock') {
      // Mock payment - Auto-succeeds for testing
      paymentIntent = await mockStripe.paymentIntents.create({
        amount: Math.round((booking.totalAmount || booking.pricing.totalAmount) * 100),
        currency: 'mad',
        metadata: {
          bookingId: booking._id.toString(),
          userId
        }
      });

      payment = await Payment.create({
        bookingId,
        amount: booking.totalAmount || booking.pricing.totalAmount,
        currency: 'MAD',
        paymentMethod: 'mock',
        gateway: {
          transactionId: paymentIntent.id,
          gatewayResponse: { status: 'test_payment', mode: 'mock' }
        },
        status: 'pending', // Start as pending for realistic flow
        escrowStatus: 'held',
      });

      // Update booking status
      await Booking.findByIdAndUpdate(bookingId, {
        status: 'confirmed',
        paymentId: payment._id
      });

      res.status(200).json({
        success: true,
        message: 'Payment intent created successfully',
        data: {
          payment,
          clientSecret: paymentIntent.client_secret,
          paymentMethod: 'mock'
        }
      });

    } else {
      // Stripe/Online payment (for future integration)
      paymentIntent = await mockStripe.paymentIntents.create({
        amount: Math.round((booking.totalAmount || booking.pricing.totalAmount) * 100),
        currency: 'mad',
        metadata: {
          bookingId: booking._id.toString(),
          userId
        }
      });

      payment = await Payment.create({
        bookingId,
        amount: booking.totalAmount || booking.pricing.totalAmount,
        currency: 'MAD',
        paymentMethod: 'stripe',
        gateway: {
          transactionId: paymentIntent.id,
          gatewayResponse: paymentIntent
        },
        status: 'pending',
        escrowStatus: 'held'
      });

      res.status(201).json({
        success: true,
        data: {
          clientSecret: paymentIntent.client_secret,
          payment
        }
      });
    }
  } catch (error) {
    next(error);
  }
};

// Confirm payment
export const confirmPayment = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { paymentIntentId } = req.body;

    // Retrieve payment intent (mock for now)
    const paymentIntent = await mockStripe.paymentIntents.retrieve(paymentIntentId);

    // Find payment record
    const payment = await Payment.findOne({ 'gateway.transactionId': paymentIntentId });
    if (!payment) {
      return next(new AppError('Payment not found', 404));
    }

    if (paymentIntent.status === 'succeeded') {
      payment.status = 'completed';
      payment.escrowStatus = 'held';
      payment.paidAt = new Date();
      await payment.save();

      // Update booking status
      await Booking.findByIdAndUpdate(payment.bookingId, {
        status: 'confirmed',
        paymentId: payment._id
      });

      res.json({
        success: true,
        message: 'Payment confirmed successfully',
        data: { payment }
      });
    } else {
      payment.status = 'failed';
      await payment.save();

      return next(new AppError('Payment confirmation failed', 400));
    }
  } catch (error) {
    next(error);
  }
};

// Confirm cash payment received (Host only)
export const confirmCashPayment = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const userId = (req as any).user.userId;

    const payment = await Payment.findById(id).populate('bookingId');
    if (!payment) {
      return next(new AppError('Payment not found', 404));
    }

    // Check if host owns this booking
    const booking = payment.bookingId as any;
    if (getObjectIdString(booking.hostId) !== userId) {
      return next(new AppError('Only the host can confirm cash payment', 403));
    }

    if (payment.paymentMethod !== 'cash') {
      return next(new AppError('This is not a cash payment', 400));
    }

    if (payment.status === 'completed') {
      return next(new AppError('Payment already confirmed', 400));
    }

    // Confirm payment
    payment.status = 'completed';
    payment.paidAt = new Date();
    payment.notes = (payment.notes || '') + ' | Confirmed by host on ' + new Date().toISOString();
    await payment.save();

    res.json({
      success: true,
      message: 'Cash payment confirmed successfully',
      data: { payment }
    });
  } catch (error) {
    next(error);
  }
};

// Get payment by ID
export const getPaymentById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const userId = (req as any).user.userId;

    const payment = await Payment.findById(id)
      .populate('bookingId');

    if (!payment) {
      return next(new AppError('Payment not found', 404));
    }

    // Check authorization (payment belongs to booking's tourist or host)
    const booking = await Booking.findById(payment.bookingId).populate('serviceId');
    if (booking) {
      const service: any = booking.serviceId;
      const isTourist = getObjectIdString(booking.touristId) === userId;
      const isHost = service && getObjectIdString(service.hostId) === userId;
      const isAdmin = (req as any).user.role === 'admin';
      
      if (!isTourist && !isHost && !isAdmin) {
        return next(new AppError('Not authorized to view this payment', 403));
      }
    }

    res.json({
      success: true,
      data: { payment }
    });
  } catch (error) {
    next(error);
  }
};

// Get user payments
export const getMyPayments = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = (req as any).user.userId;
    const { status, page = '1', limit = '10' } = req.query;

    // Find bookings where user is tourist, then find their payments
    const bookings = await Booking.find({ touristId: userId }).select('_id');
    const bookingIds = bookings.map(b => b._id);

    const query: any = { bookingId: { $in: bookingIds } };
    if (status) query.status = status;

    const pageNum = parseInt(page as string);
    const limitNum = parseInt(limit as string);
    const skip = (pageNum - 1) * limitNum;

    const payments = await Payment.find(query)
      .populate({
        path: 'bookingId',
        populate: { path: 'serviceId', select: 'title photos' }
      })
      .sort('-createdAt')
      .skip(skip)
      .limit(limitNum);

    const total = await Payment.countDocuments(query);

    res.json({
      success: true,
      data: {
        payments,
        pagination: {
          page: pageNum,
          limit: limitNum,
          total,
          pages: Math.ceil(total / limitNum)
        }
      }
    });
  } catch (error) {
    next(error);
  }
};

// Release payment to provider (admin action or auto after completion)
export const releasePayment = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;

    const payment = await Payment.findById(id).populate('bookingId');
    if (!payment) {
      return next(new AppError('Payment not found', 404));
    }

    // Check if payment can be released
    if (payment.status !== 'completed') {
      return next(new AppError('Payment not completed', 400));
    }

    if (payment.escrowStatus !== 'held') {
      return next(new AppError('Payment already released or refunded', 400));
    }

    // Check if booking is completed
    const booking = await Booking.findById(payment.bookingId);
    if (booking?.status !== 'completed') {
      return next(new AppError('Booking not completed yet', 400));
    }

    payment.escrowStatus = 'released';
    payment.releasedAt = new Date();
    await payment.save();

    res.json({
      success: true,
      message: 'Payment released to provider',
      data: { payment }
    });
  } catch (error) {
    next(error);
  }
};

// Refund payment
export const refundPayment = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const { paymentId, reason } = req.body;
    
    // Accept payment ID from either params or body
    const paymentIdToUse = id || paymentId;
    
    if (!paymentIdToUse) {
      return next(new AppError('Payment ID is required', 400));
    }

    const payment = await Payment.findById(paymentIdToUse).populate('bookingId');
    if (!payment) {
      return next(new AppError('Payment not found', 404));
    }

    if (payment.status !== 'completed') {
      return next(new AppError('Payment not completed', 400));
    }

    if (payment.escrowStatus === 'released') {
      return next(new AppError('Payment already released, cannot refund', 400));
    }
    
    // Check if booking can be refunded (only cancelled bookings can be refunded)
    const booking = await Booking.findById(payment.bookingId);
    if (booking && booking.status !== 'cancelled') {
      return next(new AppError('Active bookings cannot be refunded', 400));
    }

    // Create mock Stripe refund (replace with real Stripe when configured)
    if (payment.paymentMethod === 'stripe') {
      const transactionId = payment.gateway?.transactionId || 'mock_transaction_' + Date.now();
      
      const refund = await mockStripe.refunds.create({
        payment_intent: transactionId,
        amount: payment.amount * 100
      });

      payment.status = 'refunded';
      payment.escrowStatus = 'refunded';
      payment.refundedAt = new Date();
      payment.gateway = payment.gateway || {};
      payment.gateway.gatewayResponse = { ...payment.gateway.gatewayResponse, refund, refundReason: reason };
      await payment.save();

      // Update booking
      await Booking.findByIdAndUpdate(payment.bookingId, {
        status: 'cancelled',
        cancellationReason: reason
      });

      res.json({
        success: true,
        message: 'Payment refunded successfully',
        data: { payment }
      });
    } else {
      return next(new AppError('Invalid payment method for refund', 400));
    }
  } catch (error) {
    next(error);
  }
};

// Webhook handler for Stripe events (mock for demonstration)
export const stripeWebhook = async (req: Request, res: Response, next: NextFunction) => {
  try {
    // Mock webhook handler - Replace with real Stripe webhook verification when configured
    const event = req.body;

    // Handle the event
    switch (event.type) {
      case 'payment_intent.succeeded':
        const paymentIntent = event.data.object;
        await Payment.findOneAndUpdate(
          { 'gateway.transactionId': paymentIntent.id },
          {
            status: 'completed',
            escrowStatus: 'held',
            paidAt: new Date()
          }
        );
        break;

      case 'payment_intent.payment_failed':
        const failedPayment = event.data.object;
        await Payment.findOneAndUpdate(
          { 'gateway.transactionId': failedPayment.id },
          { status: 'failed' }
        );
        break;

      default:
        console.log(`Unhandled event type: ${event.type}`);
    }

    res.json({ received: true, message: 'Mock webhook processed' });
  } catch (error) {
    next(error);
  }
};

