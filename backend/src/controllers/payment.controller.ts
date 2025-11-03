import { Request, Response, NextFunction } from 'express';
import Stripe from 'stripe';
import Payment from '../models/Payment.model';
import Booking from '../models/Booking.model';
import { AppError } from '../middleware/error.middleware';
import { config } from '../config/environment';

const stripe = new Stripe(config.payment.stripe.secretKey || '', { apiVersion: '2024-12-18.acacia' });

// Create payment intent
export const createPaymentIntent = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = (req as any).user.userId;
    const { bookingId } = req.body;

    // Get booking
    const booking = await Booking.findById(bookingId);
    if (!booking) {
      return next(new AppError('Booking not found', 404));
    }

    // Check authorization
    if (booking.user.toString() !== userId) {
      return next(new AppError('Not authorized to pay for this booking', 403));
    }

    // Check if already paid
    const existingPayment = await Payment.findOne({ booking: bookingId });
    if (existingPayment && existingPayment.status === 'completed') {
      return next(new AppError('Booking already paid', 400));
    }

    // Create Stripe payment intent
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(booking.totalAmount * 100), // Convert to cents
      currency: 'mad', // Moroccan Dirham
      metadata: {
        bookingId: booking._id.toString(),
        userId
      }
    });

    // Create or update payment record
    let payment;
    if (existingPayment) {
      existingPayment.transactionId = paymentIntent.id;
      existingPayment.gatewayResponse = paymentIntent;
      await existingPayment.save();
      payment = existingPayment;
    } else {
      payment = await Payment.create({
        booking: bookingId,
        user: userId,
        amount: booking.totalAmount,
        paymentMethod: 'stripe',
        transactionId: paymentIntent.id,
        status: 'pending',
        gatewayResponse: paymentIntent
      });
    }

    res.status(201).json({
      success: true,
      data: {
        clientSecret: paymentIntent.client_secret,
        payment
      }
    });
  } catch (error) {
    next(error);
  }
};

// Confirm payment
export const confirmPayment = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { paymentIntentId } = req.body;

    // Retrieve payment intent from Stripe
    const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);

    // Find payment record
    const payment = await Payment.findOne({ transactionId: paymentIntentId });
    if (!payment) {
      return next(new AppError('Payment not found', 404));
    }

    if (paymentIntent.status === 'succeeded') {
      payment.status = 'completed';
      payment.escrowStatus = 'held';
      payment.completedAt = new Date();
      await payment.save();

      // Update booking status
      await Booking.findByIdAndUpdate(payment.booking, {
        status: 'confirmed',
        payment: payment._id
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

// Get payment by ID
export const getPaymentById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const userId = (req as any).user.userId;

    const payment = await Payment.findById(id)
      .populate('booking')
      .populate('user', 'firstName lastName email');

    if (!payment) {
      return next(new AppError('Payment not found', 404));
    }

    // Check authorization
    if (
      payment.user.toString() !== userId &&
      (req as any).user.role !== 'admin'
    ) {
      return next(new AppError('Not authorized to view this payment', 403));
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

    const query: any = { user: userId };
    if (status) query.status = status;

    const pageNum = parseInt(page as string);
    const limitNum = parseInt(limit as string);
    const skip = (pageNum - 1) * limitNum;

    const payments = await Payment.find(query)
      .populate({
        path: 'booking',
        populate: { path: 'service', select: 'title photos' }
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

    const payment = await Payment.findById(id).populate('booking');
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
    const booking = await Booking.findById(payment.booking);
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
    const { reason } = req.body;

    const payment = await Payment.findById(id);
    if (!payment) {
      return next(new AppError('Payment not found', 404));
    }

    if (payment.status !== 'completed') {
      return next(new AppError('Payment not completed', 400));
    }

    if (payment.escrowStatus === 'released') {
      return next(new AppError('Payment already released, cannot refund', 400));
    }

    // Create Stripe refund
    if (payment.paymentMethod === 'stripe' && payment.transactionId) {
      const refund = await stripe.refunds.create({
        payment_intent: payment.transactionId,
        reason: 'requested_by_customer'
      });

      payment.status = 'refunded';
      payment.escrowStatus = 'refunded';
      payment.refundedAt = new Date();
      payment.refundReason = reason;
      payment.gatewayResponse = { ...payment.gatewayResponse, refund };
      await payment.save();

      // Update booking
      await Booking.findByIdAndUpdate(payment.booking, {
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

// Webhook handler for Stripe events
export const stripeWebhook = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const sig = req.headers['stripe-signature'] as string;
    const webhookSecret = config.stripe.webhookSecret;

    let event: Stripe.Event;

    try {
      event = stripe.webhooks.constructEvent(req.body, sig, webhookSecret);
    } catch (err: any) {
      return next(new AppError(`Webhook Error: ${err.message}`, 400));
    }

    // Handle the event
    switch (event.type) {
      case 'payment_intent.succeeded':
        const paymentIntent = event.data.object as Stripe.PaymentIntent;
        await Payment.findOneAndUpdate(
          { transactionId: paymentIntent.id },
          {
            status: 'completed',
            escrowStatus: 'held',
            completedAt: new Date()
          }
        );
        break;

      case 'payment_intent.payment_failed':
        const failedPayment = event.data.object as Stripe.PaymentIntent;
        await Payment.findOneAndUpdate(
          { transactionId: failedPayment.id },
          { status: 'failed' }
        );
        break;

      default:
        console.log(`Unhandled event type: ${event.type}`);
    }

    res.json({ received: true });
  } catch (error) {
    next(error);
  }
};

