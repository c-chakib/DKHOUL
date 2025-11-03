import mongoose, { Schema, Document } from 'mongoose';

export interface IReview extends Document {
  bookingId: mongoose.Types.ObjectId;
  reviewerId: mongoose.Types.ObjectId;
  revieweeId: mongoose.Types.ObjectId;
  serviceId: mongoose.Types.ObjectId;
  reviewerType: 'tourist' | 'host';
  ratings: {
    overall: number;
    communication: number;
    accuracy: number;
    value: number;
    cleanliness?: number;
  };
  comment: string;
  photos: string[];
  response?: {
    text: string;
    respondedAt: Date;
  };
  createdAt: Date;
  expiresAt: Date;
}

const ReviewSchema = new Schema<IReview>(
  {
    bookingId: {
      type: Schema.Types.ObjectId,
      ref: 'Booking',
      required: true
    },
    reviewerId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    revieweeId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    serviceId: {
      type: Schema.Types.ObjectId,
      ref: 'Service',
      required: true,
      index: true
    },
    reviewerType: {
      type: String,
      enum: ['tourist', 'host'],
      required: true
    },
    ratings: {
      overall: {
        type: Number,
        required: true,
        min: 1,
        max: 5
      },
      communication: {
        type: Number,
        required: true,
        min: 1,
        max: 5
      },
      accuracy: {
        type: Number,
        required: true,
        min: 1,
        max: 5
      },
      value: {
        type: Number,
        required: true,
        min: 1,
        max: 5
      },
      cleanliness: {
        type: Number,
        min: 1,
        max: 5
      }
    },
    comment: {
      type: String,
      required: [true, 'Comment is required'],
      minlength: [10, 'Comment must be at least 10 characters'],
      maxlength: [1000, 'Comment cannot exceed 1000 characters']
    },
    photos: {
      type: [String],
      default: []
    },
    response: {
      text: String,
      respondedAt: Date
    },
    expiresAt: {
      type: Date,
      required: true
    }
  },
  {
    timestamps: true
  }
);

// Compound index to ensure one review per booking per reviewer type
ReviewSchema.index({ bookingId: 1, reviewerType: 1 }, { unique: true });
ReviewSchema.index({ serviceId: 1, createdAt: -1 });

export default mongoose.model<IReview>('Review', ReviewSchema);
