import Stripe from 'stripe';
import { config } from '../config/environment';

const isTest = config.env === 'test' || process.env.NODE_ENV === 'test';

// Use a lightweight mock in tests to avoid calling external Stripe API
let stripe: any;
if (isTest) {
  stripe = {
    paymentIntents: {
      create: async (params: any) => ({
        id: `pi_mock_${Date.now()}`,
        client_secret: `pi_mock_${Date.now()}_secret_${Math.random().toString(36).substring(7)}`,
        amount: params.amount,
        currency: params.currency,
        status: 'requires_payment_method',
        metadata: params.metadata
      }),
      retrieve: async (id: string) => ({ id, status: 'succeeded', amount: 10000, currency: 'mad' }),
      confirm: async (id: string) => ({ id, status: 'succeeded' })
    },
    refunds: {
      create: async (params: any) => ({ id: `re_mock_${Date.now()}`, payment_intent: params.payment_intent, amount: params.amount, status: 'succeeded' }),
      retrieve: async (id: string) => ({ id, status: 'succeeded' })
    },
    customers: {
      create: async (p: any) => ({ id: `cus_mock_${Date.now()}`, ...p }),
      retrieve: async (id: string) => ({ id })
    },
    setupIntents: { create: async (_: any) => ({ id: `seti_mock_${Date.now()}` }) },
    paymentMethods: {
      list: async (_: any) => ({ data: [] }),
      detach: async (id: string) => ({ id })
    },
    payouts: { create: async (_: any) => ({ id: `po_mock_${Date.now()}` }) },
    webhooks: { constructEvent: (_: any) => { throw new Error('webhook constructEvent not available in test mock'); } }
  };
} else {
  const secretKey = (config as any).stripe?.secretKey || (config as any).payment?.stripe?.secretKey || process.env.STRIPE_SECRET_KEY || '';
  stripe = new Stripe(secretKey as string, {
    // omit apiVersion here so library default is used
  } as any);
}

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

