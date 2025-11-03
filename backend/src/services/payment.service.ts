import Stripe from 'stripe';
import { config } from '../config/environment';

const stripe = new Stripe(config.stripe.secretKey, {
  apiVersion: '2024-12-18.acacia' as any
});

// Create payment intent
export const createPaymentIntent = async (
  amount: number,
  currency: string = 'mad',
  metadata?: Record<string, string>
): Promise<Stripe.PaymentIntent> => {
  try {
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(amount * 100), // Convert to cents
      currency,
      metadata: metadata || {},
      automatic_payment_methods: {
        enabled: true
      }
    });
    return paymentIntent;
  } catch (error: any) {
    console.error('❌ Payment intent creation failed:', error);
    throw new Error(`Payment intent creation failed: ${error.message}`);
  }
};

// Retrieve payment intent
export const retrievePaymentIntent = async (paymentIntentId: string): Promise<Stripe.PaymentIntent> => {
  try {
    const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);
    return paymentIntent;
  } catch (error: any) {
    console.error('❌ Payment intent retrieval failed:', error);
    throw new Error(`Payment intent retrieval failed: ${error.message}`);
  }
};

// Confirm payment intent
export const confirmPaymentIntent = async (paymentIntentId: string): Promise<Stripe.PaymentIntent> => {
  try {
    const paymentIntent = await stripe.paymentIntents.confirm(paymentIntentId);
    return paymentIntent;
  } catch (error: any) {
    console.error('❌ Payment confirmation failed:', error);
    throw new Error(`Payment confirmation failed: ${error.message}`);
  }
};

// Create refund
export const createRefund = async (
  paymentIntentId: string,
  amount?: number,
  reason?: 'duplicate' | 'fraudulent' | 'requested_by_customer'
): Promise<Stripe.Refund> => {
  try {
    const refundData: Stripe.RefundCreateParams = {
      payment_intent: paymentIntentId,
      reason: reason || 'requested_by_customer'
    };

    if (amount) {
      refundData.amount = Math.round(amount * 100);
    }

    const refund = await stripe.refunds.create(refundData);
    return refund;
  } catch (error: any) {
    console.error('❌ Refund creation failed:', error);
    throw new Error(`Refund creation failed: ${error.message}`);
  }
};

// Retrieve refund
export const retrieveRefund = async (refundId: string): Promise<Stripe.Refund> => {
  try {
    const refund = await stripe.refunds.retrieve(refundId);
    return refund;
  } catch (error: any) {
    console.error('❌ Refund retrieval failed:', error);
    throw new Error(`Refund retrieval failed: ${error.message}`);
  }
};

// Create customer
export const createCustomer = async (
  email: string,
  name: string,
  metadata?: Record<string, string>
): Promise<Stripe.Customer> => {
  try {
    const customer = await stripe.customers.create({
      email,
      name,
      metadata: metadata || {}
    });
    return customer;
  } catch (error: any) {
    console.error('❌ Customer creation failed:', error);
    throw new Error(`Customer creation failed: ${error.message}`);
  }
};

// Retrieve customer
export const retrieveCustomer = async (customerId: string): Promise<Stripe.Customer> => {
  try {
    const customer = await stripe.customers.retrieve(customerId) as Stripe.Customer;
    return customer;
  } catch (error: any) {
    console.error('❌ Customer retrieval failed:', error);
    throw new Error(`Customer retrieval failed: ${error.message}`);
  }
};

// Create setup intent (for saving payment methods)
export const createSetupIntent = async (customerId: string): Promise<Stripe.SetupIntent> => {
  try {
    const setupIntent = await stripe.setupIntents.create({
      customer: customerId,
      automatic_payment_methods: {
        enabled: true
      }
    });
    return setupIntent;
  } catch (error: any) {
    console.error('❌ Setup intent creation failed:', error);
    throw new Error(`Setup intent creation failed: ${error.message}`);
  }
};

// List customer payment methods
export const listPaymentMethods = async (customerId: string): Promise<Stripe.PaymentMethod[]> => {
  try {
    const paymentMethods = await stripe.paymentMethods.list({
      customer: customerId,
      type: 'card'
    });
    return paymentMethods.data;
  } catch (error: any) {
    console.error('❌ Payment methods retrieval failed:', error);
    throw new Error(`Payment methods retrieval failed: ${error.message}`);
  }
};

// Detach payment method
export const detachPaymentMethod = async (paymentMethodId: string): Promise<Stripe.PaymentMethod> => {
  try {
    const paymentMethod = await stripe.paymentMethods.detach(paymentMethodId);
    return paymentMethod;
  } catch (error: any) {
    console.error('❌ Payment method detachment failed:', error);
    throw new Error(`Payment method detachment failed: ${error.message}`);
  }
};

// Create payout (for providers)
export const createPayout = async (
  amount: number,
  currency: string = 'mad',
  destination: string
): Promise<Stripe.Payout> => {
  try {
    const payout = await stripe.payouts.create({
      amount: Math.round(amount * 100),
      currency,
      destination
    });
    return payout;
  } catch (error: any) {
    console.error('❌ Payout creation failed:', error);
    throw new Error(`Payout creation failed: ${error.message}`);
  }
};

// Calculate service fee
export const calculateServiceFee = (amount: number, feePercentage: number = 10): number => {
  return Math.round(amount * (feePercentage / 100) * 100) / 100;
};

// Calculate payout amount (total - service fee)
export const calculatePayoutAmount = (totalAmount: number, feePercentage: number = 10): number => {
  const serviceFee = calculateServiceFee(totalAmount, feePercentage);
  return totalAmount - serviceFee;
};

// Verify webhook signature
export const verifyWebhookSignature = (
  payload: string | Buffer,
  signature: string,
  secret: string
): Stripe.Event => {
  try {
    const event = stripe.webhooks.constructEvent(payload, signature, secret);
    return event;
  } catch (error: any) {
    console.error('❌ Webhook signature verification failed:', error);
    throw new Error(`Webhook signature verification failed: ${error.message}`);
  }
};

// Format amount for display
export const formatAmount = (amount: number, currency: string = 'MAD'): string => {
  return `${amount.toFixed(2)} ${currency}`;
};

// Check if payment is successful
export const isPaymentSuccessful = (paymentIntent: Stripe.PaymentIntent): boolean => {
  return paymentIntent.status === 'succeeded';
};

// Check if payment requires action
export const paymentRequiresAction = (paymentIntent: Stripe.PaymentIntent): boolean => {
  return paymentIntent.status === 'requires_action';
};

