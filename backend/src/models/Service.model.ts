import mongoose, { Schema, Document } from 'mongoose';

export interface IService extends Document {
  hostId: mongoose.Types.ObjectId;
  category: 'Space' | 'Skills' | 'Connect';
  title: string;
  description: string;
  photos: string[];
  pricing: {
    amount: number;
    currency: string;
    priceType: 'per_hour' | 'per_day' | 'fixed';
  };
  location: {
    type: string;
    coordinates: number[];
    address: string;
    city: string;
    region: string;
  };
  availability: Array<{
    date: Date;
    timeSlots: Array<{
      startTime: string;
      endTime: string;
      available: boolean;
    }>;
  }>;
  capacity: number;
  languages: string[];
  amenities: string[];
  rating: {
    average: number;
    count: number;
  };
  status: 'draft' | 'pending' | 'active' | 'rejected' | 'archived';
  rejectionReason?: string;
  createdAt: Date;
  updatedAt: Date;
}

const ServiceSchema = new Schema<IService>(
  {
    hostId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true
    },
    category: {
      type: String,
      enum: ['Space', 'Skills', 'Connect'],
      required: [true, 'Category is required']
    },
    title: {
      type: String,
      required: [true, 'Title is required'],
      trim: true,
      minlength: [10, 'Title must be at least 10 characters'],
      maxlength: [100, 'Title cannot exceed 100 characters']
    },
    description: {
      type: String,
      required: [true, 'Description is required'],
      minlength: [50, 'Description must be at least 50 characters'],
      maxlength: [2000, 'Description cannot exceed 2000 characters']
    },
    photos: {
      type: [String],
      validate: {
        validator: function(v: string[]) {
          return v.length >= 1 && v.length <= 10;
        },
        message: 'Must have between 1 and 10 photos'
      },
      required: [true, 'At least 1 photo is required']
    },
    pricing: {
      amount: {
        type: Number,
        required: [true, 'Price is required'],
        min: [0, 'Price cannot be negative']
      },
      currency: {
        type: String,
        default: 'MAD'
      },
      priceType: {
        type: String,
        enum: ['per_hour', 'per_day', 'fixed'],
        required: true
      }
    },
    location: {
      type: {
        type: String,
        enum: ['Point'],
        default: 'Point'
      },
      coordinates: {
        type: [Number],
        required: [true, 'Coordinates are required'],
        validate: {
          validator: function(v: number[]) {
            return v.length === 2 && v[0] >= -180 && v[0] <= 180 && v[1] >= -90 && v[1] <= 90;
          },
          message: 'Invalid coordinates'
        }
      },
      address: {
        type: String,
        required: [true, 'Address is required']
      },
      city: {
        type: String,
        required: [true, 'City is required']
      },
      region: {
        type: String,
        required: [true, 'Region is required']
      }
    },
    availability: [{
      date: {
        type: Date,
        required: true
      },
      timeSlots: [{
        startTime: {
          type: String,
          required: true
        },
        endTime: {
          type: String,
          required: true
        },
        available: {
          type: Boolean,
          default: true
        }
      }]
    }],
    capacity: {
      type: Number,
      required: [true, 'Capacity is required'],
      min: [1, 'Capacity must be at least 1']
    },
    languages: {
      type: [String],
      default: []
    },
    amenities: {
      type: [String],
      default: []
    },
    rating: {
      average: {
        type: Number,
        default: 0,
        min: 0,
        max: 5
      },
      count: {
        type: Number,
        default: 0
      }
    },
    status: {
      type: String,
      enum: ['draft', 'pending', 'active', 'rejected', 'archived'],
      default: 'draft'
    },
    rejectionReason: String
  },
  {
    timestamps: true
  }
);

// Indexes for search and geolocation
ServiceSchema.index({ 'location.coordinates': '2dsphere' });
ServiceSchema.index({ category: 1, status: 1 });
ServiceSchema.index({ title: 'text', description: 'text' });
ServiceSchema.index({ 'location.city': 1 });
ServiceSchema.index({ 'rating.average': -1 });

export default mongoose.model<IService>('Service', ServiceSchema);
