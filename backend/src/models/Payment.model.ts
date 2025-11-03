import mongoose, { Schema, Document } from 'mongoose';

export interface IPayment extends Document {
  bookingId: mongoose.Types.ObjectId;
  amount: number;
  currency: string;
  paymentMethod: 'stripe' | 'paypal' | 'cash';
  gateway: {
    transactionId?: string;
    gatewayResponse?: any;
  };
  escrowStatus: 'held' | 'released' | 'refunded';
  status: 'pending' | 'completed' | 'failed' | 'refunded';
  paidAt?: Date;
  releasedAt?: Date;
  refundedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const PaymentSchema = new Schema<IPayment>(
  {
    bookingId: {
      type: Schema.Types.ObjectId,
      ref: 'Booking',
      required: true,
      unique: true
    },
    amount: {
      type: Number,
      required: true,
      min: 0
    },
    currency: {
      type: String,
      default: 'MAD'
    },
    paymentMethod: {
      type: String,
      enum: ['stripe', 'paypal', 'cash'],
      required: true
    },
    gateway: {
      transactionId: String,
      gatewayResponse: Schema.Types.Mixed
    },
    escrowStatus: {
      type: String,
      enum: ['held', 'released', 'refunded'],
      default: 'held'
    },
    status: {
      type: String,
      enum: ['pending', 'completed', 'failed', 'refunded'],
      default: 'pending'
    },
    paidAt: Date,
    releasedAt: Date,
    refundedAt: Date
  },
  {
    timestamps: true
  }
);

// Indexes
PaymentSchema.index({ bookingId: 1 });
PaymentSchema.index({ status: 1 });
PaymentSchema.index({ 'gateway.transactionId': 1 });

export default mongoose.model<IPayment>('Payment', PaymentSchema);
