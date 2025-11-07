import mongoose, { Schema, Document } from 'mongoose';

export interface IPayment extends Document {
  bookingId: mongoose.Types.ObjectId;
  userId?: mongoose.Types.ObjectId; // Add userId field for backward compatibility
  amount: number;
  currency: string;
  paymentMethod: 'stripe' | 'paypal' | 'cash' | 'mock';
  gateway: {
    transactionId?: string;
    gatewayResponse?: any;
  };
  escrowStatus: 'held' | 'released' | 'refunded' | 'not_applicable';
  status: 'pending' | 'completed' | 'failed' | 'refunded';
  paidAt?: Date;
  releasedAt?: Date;
  refundedAt?: Date;
  notes?: string;
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
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User'
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
      enum: ['stripe', 'paypal', 'cash', 'mock'],
      required: true
    },
    gateway: {
      transactionId: String,
      gatewayResponse: Schema.Types.Mixed
    },
    escrowStatus: {
      type: String,
      enum: ['held', 'released', 'refunded', 'not_applicable'],
      default: 'held'
    },
    status: {
      type: String,
      enum: ['pending', 'completed', 'failed', 'refunded'],
      default: 'pending'
    },
    paidAt: Date,
    releasedAt: Date,
    refundedAt: Date,
    notes: String
  },
  {
    timestamps: true
  }
);

// Indexes
PaymentSchema.index({ bookingId: 1 });
PaymentSchema.index({ status: 1 });
PaymentSchema.index({ 'gateway.transactionId': 1 });

// Virtual to support both `booking` and `bookingId` access patterns
PaymentSchema.virtual('booking')
  .get(function(this: IPayment) {
    return this.bookingId;
  })
  .set(function(this: IPayment, value: mongoose.Types.ObjectId) {
    this.bookingId = value;
  });

// Virtual to support `user` field (maps to userId)
PaymentSchema.virtual('user')
  .get(function(this: IPayment) {
    return this.userId;
  })
  .set(function(this: IPayment, value: mongoose.Types.ObjectId) {
    this.userId = value;
  });

// Virtual to support `transactionId` field (maps to gateway.transactionId)
PaymentSchema.virtual('transactionId')
  .get(function(this: IPayment) {
    return this.gateway?.transactionId;
  })
  .set(function(this: IPayment, value: string) {
    if (!this.gateway) {
      this.gateway = { transactionId: value };
    } else {
      this.gateway.transactionId = value;
    }
  });

PaymentSchema.set('toJSON', { virtuals: true });
PaymentSchema.set('toObject', { virtuals: true });

export default mongoose.model<IPayment>('Payment', PaymentSchema);
