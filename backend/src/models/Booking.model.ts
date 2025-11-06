import mongoose, { Schema, Document } from 'mongoose';

export interface IBooking extends Document {
  serviceId: mongoose.Types.ObjectId;
  touristId: mongoose.Types.ObjectId;
  hostId: mongoose.Types.ObjectId;
  bookingDate: Date;
  timeSlot: {
    startTime: string;
    endTime: string;
  };
  numberOfGuests: number;
  pricing: {
    baseAmount: number;
    serviceFee: number;
    totalAmount: number;
    currency: string;
  };
  // compatibility alias for tests that expect booking.totalAmount
  totalAmount?: number;
  status: 'pending' | 'confirmed' | 'rejected' | 'completed' | 'cancelled';
  paymentId?: mongoose.Types.ObjectId;
  cancellationReason?: string;
  completedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const BookingSchema = new Schema<IBooking>(
  {
    serviceId: {
      type: Schema.Types.ObjectId,
      ref: 'Service',
      required: true,
      index: true
    },
    touristId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true
    },
    hostId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true
    },
    bookingDate: {
      type: Date,
      required: [true, 'Booking date is required']
    },
    timeSlot: {
      startTime: {
        type: String,
        required: true
      },
      endTime: {
        type: String,
        required: true
      }
    },
    numberOfGuests: {
      type: Number,
      required: true,
      min: [1, 'At least 1 guest is required']
    },
    pricing: {
      baseAmount: {
        type: Number,
        required: true
      },
      serviceFee: {
        type: Number,
        required: true
      },
      totalAmount: {
        type: Number,
        required: true
      },
      currency: {
        type: String,
        default: 'MAD'
      }
    },
    status: {
      type: String,
      enum: ['pending', 'confirmed', 'rejected', 'completed', 'cancelled'],
      default: 'pending'
    },
    paymentId: {
      type: Schema.Types.ObjectId,
      ref: 'Payment'
    },
    cancellationReason: String,
    completedAt: Date
  },
  {
    timestamps: true
  }
);

// Indexes
BookingSchema.index({ status: 1, bookingDate: 1 });

// Virtual alias to expose pricing.totalAmount as booking.totalAmount
BookingSchema.virtual('totalAmount').get(function(this: IBooking) {
  return this.pricing?.totalAmount;
});

BookingSchema.set('toJSON', { virtuals: true });
BookingSchema.set('toObject', { virtuals: true });
BookingSchema.index({ touristId: 1, status: 1 });
BookingSchema.index({ hostId: 1, status: 1 });

export default mongoose.model<IBooking>('Booking', BookingSchema);
