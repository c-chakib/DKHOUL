import mongoose, { Schema, Document } from 'mongoose';
import bcrypt from 'bcryptjs';

export interface IUser extends Document {
  email: string;
  password: string;
  role: 'tourist' | 'host' | 'admin' | 'provider';
  status?: 'active' | 'suspended' | 'banned';
  // Compatibility aliases (virtuals) for tests that expect top-level fields
  firstName?: string;
  lastName?: string;
  photo?: string;
  phoneNumber?: string;
  bio?: string;
  address?: string;
  city?: string;
  country?: string;
  languages?: string[];
  verifiedProvider?: boolean;
  profile: {
    firstName: string;
    lastName: string;
    phone?: string;
    photo?: string;
    languages: string[];
    bio?: string;
  };
  oauth?: {
    googleId?: string;
    facebookId?: string;
  };
  emailVerified: boolean;
  verificationToken?: string;
  resetPasswordToken?: string;
  resetPasswordExpires?: Date;
  notificationPreferences: {
    email: boolean;
    push: boolean;
    sms: boolean;
  };
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
  comparePassword(candidatePassword: string): Promise<boolean>;
}

const UserSchema = new Schema<IUser>(
  {
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, 'Please provide a valid email']
    },
    password: {
      type: String,
      required: function(this: IUser) {
        return !this.oauth?.googleId && !this.oauth?.facebookId;
      },
      minlength: [8, 'Password must be at least 8 characters'],
      select: false
    },
    role: {
      type: String,
      enum: ['tourist', 'host', 'admin', 'provider'],
      default: 'tourist'
    },
    profile: {
      firstName: {
        type: String,
        required: [true, 'First name is required'],
        trim: true
      },
      lastName: {
        type: String,
        required: [true, 'Last name is required'],
        trim: true
      },
      phone: {
        type: String,
        trim: true
      },
      photo: {
        type: String,
        default: 'https://via.placeholder.com/150'
      },
      languages: {
        type: [String],
        default: []
      },
      bio: {
        type: String,
        maxlength: [500, 'Bio cannot exceed 500 characters']
      }
    },
    oauth: {
      googleId: String,
      facebookId: String
    },
    // Location information
    address: {
      type: String,
      trim: true
    },
    city: {
      type: String,
      trim: true
    },
    country: {
      type: String,
      trim: true
    },
    emailVerified: {
      type: Boolean,
      default: false
    },
    verificationToken: String,
    resetPasswordToken: String,
    resetPasswordExpires: Date,
    notificationPreferences: {
      email: { type: Boolean, default: true },
      push: { type: Boolean, default: true },
      sms: { type: Boolean, default: false }
    },
    isActive: {
      type: Boolean,
      default: true
    },
    status: {
      type: String,
      enum: ['active', 'suspended', 'banned'],
      default: 'active'
    }
  },
  {
    timestamps: true
  }
);

// Index for search optimization
UserSchema.index({ email: 1 });
UserSchema.index({ 'profile.firstName': 'text', 'profile.lastName': 'text' });

// Expose virtuals so tests that access `user.firstName` / `user.photo` work
UserSchema.virtual('firstName').get(function(this: IUser) {
  return this.profile?.firstName;
});

UserSchema.virtual('lastName').get(function(this: IUser) {
  return this.profile?.lastName;
});

UserSchema.virtual('photo').get(function(this: IUser) {
  return this.profile?.photo;
});

UserSchema.virtual('bio').get(function(this: IUser) {
  return this.profile?.bio;
});

UserSchema.virtual('languages').get(function(this: IUser) {
  return this.profile?.languages;
});

UserSchema.virtual('phoneNumber').get(function(this: IUser) {
  return this.profile?.phone;
});

// Ensure virtuals are included when converting to JSON/object
UserSchema.set('toJSON', { virtuals: true });
UserSchema.set('toObject', { virtuals: true });

// Hash password before saving
UserSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error: any) {
    next(error);
  }
});

// Method to compare passwords
UserSchema.methods.comparePassword = async function(candidatePassword: string): Promise<boolean> {
  return bcrypt.compare(candidatePassword, this.password);
};

export default mongoose.model<IUser>('User', UserSchema);
