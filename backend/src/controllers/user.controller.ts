import { Request, Response, NextFunction } from 'express';
import User from '../models/User.model';
import { AppError } from '../middleware/error.middleware';
import { uploadImage, deleteImage } from '../services/upload.service';

// Get user profile
export const getProfile = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = (req as any).user.userId;

    const user = await User.findById(userId).select('-password');
    if (!user) {
      return next(new AppError('User not found', 404));
    }

    res.json({
      success: true,
      data: { user }
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

    res.json({
      success: true,
      data: { user }
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
      firstName,
      lastName,
      phoneNumber,
      bio,
      address,
      city,
      country,
      languages,
      notificationPreferences
    } = req.body;

    const user = await User.findById(userId);
    if (!user) {
      return next(new AppError('User not found', 404));
    }

    // Update fields
    if (firstName) user.firstName = firstName;
    if (lastName) user.lastName = lastName;
    if (phoneNumber) user.phoneNumber = phoneNumber;
    if (bio) user.bio = bio;
    if (address) user.address = address;
    if (city) user.city = city;
    if (country) user.country = country;
    if (languages) user.languages = languages;
    if (notificationPreferences) user.notificationPreferences = notificationPreferences;

    await user.save();

    // Remove password from response
    const userResponse = user.toObject();
    delete userResponse.password;

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
    if (user.photo) {
      await deleteImage(user.photo);
    }

    // Upload new photo
    const photoUrl = await uploadImage(req.file);
    user.photo = photoUrl;
    await user.save();

    res.json({
      success: true,
      message: 'Photo uploaded successfully',
      data: { photoUrl }
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

