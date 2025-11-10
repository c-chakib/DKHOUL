import { Request, Response, NextFunction } from 'express';
import User from '../models/User.model';
import Service from '../models/Service.model';
import Review from '../models/Review.model';
import { AppError } from '../middleware/error.middleware';
import { uploadImage, deleteImage } from '../services/upload.service';

// Get all users (for messaging/chat)
export const getAllUsers = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const limit = parseInt(req.query.limit as string) || 50;
    const currentUserId = (req as any).user?.userId;

    // Fetch minimal fields; virtuals will provide firstName/lastName/photo
    const users = await User.find({ _id: { $ne: currentUserId } })
      .select('_id email role status profile.firstName profile.lastName profile.photo')
      .limit(limit)
      .sort({ 'profile.firstName': 1 });

    // Map to include unified name + avatar alias
    const mapped = users.map(u => {
      const obj: any = u.toObject({ virtuals: true });
      obj.avatar = obj.profile?.photo || obj.photo || obj.avatar;
      obj.name = `${obj.profile?.firstName || ''} ${obj.profile?.lastName || ''}`.trim();
      return obj;
    });

    res.json({
      success: true,
      data: mapped
    });
  } catch (error) {
    next(error);
  }
};

// Get user profile
export const getProfile = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = (req as any).user.userId;

    const user = await User.findById(userId).select('-password');
    if (!user) {
      return next(new AppError('User not found', 404));
    }
    // Ensure avatar alias present alongside existing virtuals
    const userObj: any = user.toObject({ virtuals: true });
    userObj.avatar = userObj.profile?.photo || userObj.photo || userObj.avatar; // keep existing if already set
    res.json({
      success: true,
      data: { user: userObj }
    });
  } catch (error) {
    next(error);
  }
};

// Get user by ID
export const getUserById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;

    const user = await User.findById(id).select('-password -resetPasswordToken -verificationToken');
    if (!user) {
      return next(new AppError('User not found', 404));
    }
    const userObj: any = user.toObject({ virtuals: true });
    userObj.avatar = userObj.profile?.photo || userObj.photo || userObj.avatar;
    res.json({
      success: true,
      data: { user: userObj }
    });
  } catch (error) {
    next(error);
  }
};

// Update profile
export const updateProfile = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = (req as any).user.userId;
    const {
      // Support both naming conventions
      firstName,
      lastName,
      name, // "FirstName LastName"
      phoneNumber,
      phone,
      bio,
      description,
      address,
      city,
      country,
      location, // nested object { address, city, country }
      languages,
      notificationPreferences,
      avatar,
      coverPhoto
    } = req.body;

    const user = await User.findById(userId);
    if (!user) {
      return next(new AppError('User not found', 404));
    }

    // Handle name field (split into firstName/lastName if provided as single field)
    if (name && !firstName && !lastName) {
      const nameParts = name.trim().split(' ');
      if (nameParts.length > 0) {
        user.profile.firstName = nameParts[0];
        user.profile.lastName = nameParts.slice(1).join(' ') || nameParts[0];
      }
    } else {
      // Update profile fields (nested under profile)
      if (firstName !== undefined) user.profile.firstName = firstName;
      if (lastName !== undefined) user.profile.lastName = lastName;
    }
    
    if (phoneNumber !== undefined) user.profile.phone = phoneNumber;
    if (phone !== undefined) user.profile.phone = phone;
    if (bio !== undefined) user.profile.bio = bio;
    if (description !== undefined) user.profile.bio = description; // Map description to bio
    if (languages !== undefined) user.profile.languages = languages;
    if (avatar !== undefined) user.profile.photo = avatar;
    
    // Update top-level location fields
    if (location) {
      if (location.address !== undefined) user.address = location.address;
      if (location.city !== undefined) user.city = location.city;
      if (location.country !== undefined) user.country = location.country;
    } else {
      if (address !== undefined) user.address = address;
      if (city !== undefined) user.city = city;
      if (country !== undefined) user.country = country;
    }
    
    if (notificationPreferences !== undefined) user.notificationPreferences = notificationPreferences;

    await user.save();

    // Remove password from response
    const userResponse: any = user.toObject();
    delete userResponse.password;
    // Provide top-level avatar alias for frontend components expecting `user.avatar`
    userResponse.avatar = userResponse.profile?.photo || userResponse.photo || userResponse.avatar;

    res.json({
      success: true,
      message: 'Profile updated successfully',
      data: { user: userResponse }
    });
  } catch (error) {
    next(error);
  }
};

// Upload profile photo
export const uploadProfilePhoto = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = (req as any).user.userId;

    if (!req.file) {
      return next(new AppError('Please upload an image', 400));
    }

    const user = await User.findById(userId);
    if (!user) {
      return next(new AppError('User not found', 404));
    }

    // Delete old photo if exists
    if (user.profile.photo && user.profile.photo !== 'https://via.placeholder.com/150') {
      await deleteImage(user.profile.photo);
    }

    // Upload new photo
    const photoUrl = await uploadImage(req.file);
    user.profile.photo = photoUrl;
    await user.save();

    // Remove password from response
    const userResponse: any = user.toObject();
    delete userResponse.password;
    userResponse.avatar = userResponse.profile?.photo || userResponse.photo || userResponse.avatar;

    res.json({
      success: true,
      message: 'Photo uploaded successfully',
      data: { user: userResponse }
    });
  } catch (error) {
    next(error);
  }
};

// Delete profile photo
export const deleteProfilePhoto = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = (req as any).user.userId;

    const user = await User.findById(userId);
    if (!user) {
      return next(new AppError('User not found', 404));
    }

    // Delete photo if exists
    if (user.profile.photo) {
      await deleteImage(user.profile.photo);
      user.profile.photo = undefined;
      await user.save();
    }

    res.json({
      success: true,
      message: 'Photo deleted successfully'
    });
  } catch (error) {
    next(error);
  }
};

// Update settings (notification preferences, etc.)
export const updateSettings = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = (req as any).user.userId;
    const { notificationPreferences } = req.body;

    const user = await User.findById(userId);
    if (!user) {
      return next(new AppError('User not found', 404));
    }

    if (notificationPreferences) {
      user.notificationPreferences = notificationPreferences;
      await user.save();
    }

    // Remove password from response
    const userResponse: any = user.toObject();
    delete userResponse.password;
    userResponse.avatar = userResponse.profile?.photo || userResponse.photo || userResponse.avatar;

    res.json({
      success: true,
      message: 'Settings updated successfully',
      data: { user: userResponse }
    });
  } catch (error) {
    next(error);
  }
};

// Change password
export const changePassword = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = (req as any).user.userId;
    const { currentPassword, newPassword } = req.body;

    const user = await User.findById(userId).select('+password');
    if (!user) {
      return next(new AppError('User not found', 404));
    }

    // Verify current password
    const isPasswordValid = await user.comparePassword(currentPassword);
    if (!isPasswordValid) {
      return next(new AppError('Current password is incorrect', 401));
    }

    // Update password
    user.password = newPassword; // Will be hashed by pre-save hook
    await user.save();

    res.json({
      success: true,
      message: 'Password changed successfully'
    });
  } catch (error) {
    next(error);
  }
};

// Delete account
export const deleteAccount = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = (req as any).user.userId;
    const { password } = req.body;

    const user = await User.findById(userId).select('+password');
    if (!user) {
      return next(new AppError('User not found', 404));
    }

    // Verify password
    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
      return next(new AppError('Password is incorrect', 401));
    }

    // Delete user photo if exists
    if (user.photo) {
      await deleteImage(user.photo);
    }

    await user.deleteOne();

    res.json({
      success: true,
      message: 'Account deleted successfully'
    });
  } catch (error) {
    next(error);
  }
};

// Get user statistics (for provider dashboard)
export const getUserStats = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = (req as any).user.userId;

    // Import models here to avoid circular dependency
    const Service = require('../models/Service.model').default;
    const Booking = require('../models/Booking.model').default;
    const Review = require('../models/Review.model').default;

    // Get services count
    const servicesCount = await Service.countDocuments({ provider: userId });

    // Get bookings count
    const services = await Service.find({ provider: userId }).select('_id');
    const serviceIds = services.map((s: any) => s._id);
    
    const bookingsCount = await Booking.countDocuments({
      service: { $in: serviceIds }
    });

    const completedBookings = await Booking.countDocuments({
      service: { $in: serviceIds },
      status: 'completed'
    });

    // Get reviews count and average rating
    const reviewsCount = await Review.countDocuments({
      service: { $in: serviceIds },
      reviewerType: 'guest'
    });

    const avgRating = await Review.aggregate([
      {
        $match: {
          service: { $in: serviceIds },
          reviewerType: 'guest'
        }
      },
      {
        $group: {
          _id: null,
          averageRating: { $avg: '$ratings.overall' }
        }
      }
    ]);

    // Get total earnings
    const Payment = require('../models/Payment.model').default;
    const earnings = await Payment.aggregate([
      {
        $lookup: {
          from: 'bookings',
          localField: 'booking',
          foreignField: '_id',
          as: 'bookingData'
        }
      },
      {
        $unwind: '$bookingData'
      },
      {
        $match: {
          'bookingData.service': { $in: serviceIds },
          status: 'completed',
          escrowStatus: 'released'
        }
      },
      {
        $group: {
          _id: null,
          total: { $sum: '$amount' }
        }
      }
    ]);

    res.json({
      success: true,
      data: {
        servicesCount,
        bookingsCount,
        completedBookings,
        reviewsCount,
        averageRating: avgRating[0]?.averageRating || 0,
        totalEarnings: earnings[0]?.total || 0
      }
    });
  } catch (error) {
    next(error);
  }
};

// Toggle provider verification (admin only)
export const toggleVerification = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;

    const user = await User.findById(id);
    if (!user) {
      return next(new AppError('User not found', 404));
    }

    if (user.role !== 'provider') {
      return next(new AppError('User is not a provider', 400));
    }

    user.verifiedProvider = !user.verifiedProvider;
    await user.save();

    res.json({
      success: true,
      message: `Provider ${user.verifiedProvider ? 'verified' : 'unverified'} successfully`,
      data: { user }
    });
  } catch (error) {
    next(error);
  }
};

// Get user's services
export const getUserServices = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const { page = '1', limit = '20', status = 'active' } = req.query;

    const user = await User.findById(id);
    if (!user) {
      return next(new AppError('User not found', 404));
    }

    const pageNum = parseInt(page as string);
    const limitNum = parseInt(limit as string);
    const skip = (pageNum - 1) * limitNum;

    const query: any = { hostId: id };
    if (status) {
      query.status = status;
    }

    const services = await Service.find(query)
      .skip(skip)
      .limit(limitNum)
      .sort({ createdAt: -1 });

    const total = await Service.countDocuments(query);

    res.json({
      success: true,
      data: {
        services,
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

// Get user's reviews
export const getUserReviews = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const { page = '1', limit = '20' } = req.query;

    const user = await User.findById(id);
    if (!user) {
      return next(new AppError('User not found', 404));
    }

    const pageNum = parseInt(page as string);
    const limitNum = parseInt(limit as string);
    const skip = (pageNum - 1) * limitNum;

    // Get reviews where the user is the reviewee (received reviews)
    const reviews = await Review.find({ revieweeId: id })
      .populate('reviewerId', 'profile.firstName profile.lastName profile.photo')
      .populate('serviceId', 'title')
      .skip(skip)
      .limit(limitNum)
      .sort({ createdAt: -1 });

    const total = await Review.countDocuments({ revieweeId: id });

    res.json({
      success: true,
      data: {
        reviews,
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
