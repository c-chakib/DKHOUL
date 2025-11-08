export interface Payment {
  _id: string;
  bookingId: string;
  amount: number;
  currency: string;
  status: 'pending' | 'processing' | 'completed' | 'failed' | 'refunded';
  gateway: {
    provider: 'stripe' | 'paypal' | 'cmi';
    transactionId?: string;
    paymentMethod?: string;
  };
  refund?: {
    amount: number;
    reason: string;
    processedAt: Date;
  };
  metadata?: any;
  createdAt: Date;
  updatedAt: Date;
}

