import { Request, Response, NextFunction } from 'express';
import User from '../models/User.model';
import Service from '../models/Service.model';
import Booking from '../models/Booking.model';
import Payment from '../models/Payment.model';
import Review from '../models/Review.model';
import { AppError } from '../middleware/error.middleware';

// Get all users
export const getAllUsers = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { role, status, page = '1', limit = '20', search } = req.query;

    const query: any = {};
    if (role) query.role = role;
    if (status) query.status = status;
    
    if (search) {
      query.$or = [
        { 'profile.firstName': { $regex: search, $options: 'i' } },
        { 'profile.lastName': { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } }
      ];
    }

    const pageNum = parseInt(page as string);
    const limitNum = parseInt(limit as string);
    const skip = (pageNum - 1) * limitNum;

    const users = await User.find(query)
      .select('-password')
      .sort('-createdAt')
      .skip(skip)
      .limit(limitNum);

    const total = await User.countDocuments(query);

    res.json({
      success: true,
      data: {
        users,
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

// Get user by ID (admin view)
export const getUserById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;

    const user = await User.findById(id).select('-password');
    if (!user) {
      return next(new AppError('User not found', 404));
    }

    // Get user statistics
    const servicesCount = await Service.countDocuments({ hostId: id });
    const bookingsAsUser = await Booking.countDocuments({ touristId: id });
    
    const services = await Service.find({ hostId: id }).select('_id');
    const serviceIds = services.map(s => s._id);
    const bookingsAsProvider = await Booking.countDocuments({ serviceId: { $in: serviceIds } });

    res.json({
      success: true,
      data: {
        user,
        statistics: {
          servicesCount,
          bookingsAsUser,
          bookingsAsProvider
        }
      }
    });
  } catch (error) {
    next(error);
  }
};

// Update user status (suspend/activate)
export const updateUserStatus = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!['active', 'suspended', 'banned'].includes(status)) {
      return next(new AppError('Invalid status', 400));
    }

    const user = await User.findByIdAndUpdate(
      id,
      { status, isActive: status === 'active' },
      { new: true, runValidators: true }
    ).select('-password');

    if (!user) {
      return next(new AppError('User not found', 404));
    }

    res.json({
      success: true,
      message: `User ${status === 'suspended' ? 'suspended' : status === 'banned' ? 'banned' : 'activated'} successfully`,
      data: { user }
    });
  } catch (error) {
    next(error);
  }
};

// Suspend user
export const suspendUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const { reason } = req.body;

    const user = await User.findById(id);
    
    if (!user) {
      return next(new AppError('User not found', 404));
    }

    // Prevent suspending admin accounts
    if (user.role === 'admin') {
      return next(new AppError('Cannot suspend admin accounts', 400));
    }

    user.status = 'suspended';
    user.isActive = false;
    await user.save();

    res.json({
      success: true,
      message: 'User suspended successfully',
      data: { 
        user: {
          id: user._id,
          email: user.email,
          status: user.status,
          reason
        }
      }
    });
  } catch (error) {
    next(error);
  }
};

// Delete user
export const deleteUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;

    const user = await User.findById(id);
    if (!user) {
      return next(new AppError('User not found', 404));
    }

    await user.deleteOne();

    res.json({
      success: true,
      message: 'User deleted successfully'
    });
  } catch (error) {
    next(error);
  }
};

// Get all services (admin view)
export const getAllServices = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { status, category, page = '1', limit = '20' } = req.query;

    const query: any = {};
    if (status) query.status = status;
    if (category) query.category = category;

    const pageNum = parseInt(page as string);
    const limitNum = parseInt(limit as string);
    const skip = (pageNum - 1) * limitNum;

    const services = await Service.find(query)
      .populate('hostId', 'profile.firstName profile.lastName email')
      .sort('-createdAt')
      .skip(skip)
      .limit(limitNum);

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

// Get pending services (convenience endpoint)
export const getPendingServices = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { page = '1', limit = '20' } = req.query;

    const pageNum = parseInt(page as string);
    const limitNum = parseInt(limit as string);
    const skip = (pageNum - 1) * limitNum;

    const services = await Service.find({ status: 'pending' })
      .populate('hostId', 'profile.firstName profile.lastName email')
      .sort('-createdAt')
      .skip(skip)
      .limit(limitNum);

    const total = await Service.countDocuments({ status: 'pending' });

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

// Update service status (approve/reject)
export const updateServiceStatus = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const { status, rejectionReason } = req.body;

    if (!['active', 'rejected', 'pending'].includes(status)) {
      return next(new AppError('Invalid status', 400));
    }

    const updateData: any = { status };
    if (status === 'rejected' && rejectionReason) {
      updateData.rejectionReason = rejectionReason;
    }

    const service = await Service.findByIdAndUpdate(id, updateData, { new: true });

    if (!service) {
      return next(new AppError('Service not found', 404));
    }

    res.json({
      success: true,
      message: `Service ${status} successfully`,
      data: { service }
    });
  } catch (error) {
    next(error);
  }
};

// Approve service
export const approveService = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;

    const service = await Service.findByIdAndUpdate(
      id,
      { status: 'active' },
      { new: true }
    );

    if (!service) {
      return next(new AppError('Service not found', 404));
    }

    res.json({
      success: true,
      message: 'Service approved successfully',
      data: { service }
    });
  } catch (error) {
    next(error);
  }
};

// Reject service
export const rejectService = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const { reason } = req.body;

    const updateData: any = { status: 'rejected' };
    if (reason) {
      updateData.rejectionReason = reason;
    }

    const service = await Service.findByIdAndUpdate(id, updateData, { new: true });

    if (!service) {
      return next(new AppError('Service not found', 404));
    }

    res.json({
      success: true,
      message: 'Service rejected successfully',
      data: { service }
    });
  } catch (error) {
    next(error);
  }
};

// Delete service
export const deleteService = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;

    const service = await Service.findById(id);
    if (!service) {
      return next(new AppError('Service not found', 404));
    }

    await service.deleteOne();

    res.json({
      success: true,
      message: 'Service deleted successfully'
    });
  } catch (error) {
    next(error);
  }
};

// Get all bookings
export const getAllBookings = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { status, page = '1', limit = '20' } = req.query;

    const query: any = {};
    if (status) query.status = status;

    const pageNum = parseInt(page as string);
    const limitNum = parseInt(limit as string);
    const skip = (pageNum - 1) * limitNum;

    const bookings = await Booking.find(query)
      .populate('serviceId', 'title photos')
      .populate('touristId', 'profile.firstName profile.lastName email')
      .populate('hostId', 'profile.firstName profile.lastName email')
      .sort('-createdAt')
      .skip(skip)
      .limit(limitNum);

    const total = await Booking.countDocuments(query);

    res.json({
      success: true,
      data: {
        bookings,
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

// Get all payments
export const getAllPayments = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { status, page = '1', limit = '20' } = req.query;

    const query: any = {};
    if (status) query.status = status;

    const pageNum = parseInt(page as string);
    const limitNum = parseInt(limit as string);
    const skip = (pageNum - 1) * limitNum;

    const payments = await Payment.find(query)
      .populate({
        path: 'bookingId',
        populate: [
          { path: 'serviceId', select: 'title' },
          { path: 'touristId', select: 'profile.firstName profile.lastName email' }
        ]
      })
      .sort('-createdAt')
      .skip(skip)
      .limit(limitNum);

    const total = await Payment.countDocuments(query);

    res.json({
      success: true,
      data: {
        payments,
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

// Get platform statistics
export const getPlatformStats = async (req: Request, res: Response, next: NextFunction) => {
  try {
    // User statistics
    const totalUsers = await User.countDocuments();
    const activeUsers = await User.countDocuments({ status: 'active' });
    const totalProviders = await User.countDocuments({ role: 'provider' });
    const verifiedProviders = await User.countDocuments({ role: 'provider', verifiedProvider: true });

    // Service statistics
    const totalServices = await Service.countDocuments();
    const activeServices = await Service.countDocuments({ status: 'active' });
    const pendingServices = await Service.countDocuments({ status: 'pending' });

    // Booking statistics
    const totalBookings = await Booking.countDocuments();
    const completedBookings = await Booking.countDocuments({ status: 'completed' });
    const pendingBookings = await Booking.countDocuments({ status: 'pending' });

    // Payment statistics
    const totalRevenue = await Payment.aggregate([
      { $match: { status: 'completed' } },
      { $group: { _id: null, total: { $sum: '$amount' } } }
    ]);

    const platformFees = await Payment.aggregate([
      { $match: { status: 'completed' } },
      {
        $lookup: {
          from: 'bookings',
          localField: 'bookingId',
          foreignField: '_id',
          as: 'bookingData'
        }
      },
      { $unwind: '$bookingData' },
      { $group: { _id: null, total: { $sum: '$bookingData.pricing.serviceFee' } } }
    ]);

    // Review statistics
    const totalReviews = await Review.countDocuments();
    const averageRating = await Review.aggregate([
      { $group: { _id: null, avg: { $avg: '$ratings.overall' } } }
    ]);

    res.json({
      success: true,
      data: {
        statistics: {
          totalUsers,
          activeUsers,
          totalProviders,
          verifiedProviders,
          totalServices,
          activeServices,
          pendingServices,
          totalBookings,
          completedBookings,
          pendingBookings,
          totalRevenue: totalRevenue[0]?.total || 0,
          platformFees: platformFees[0]?.total || 0,
          totalReviews,
          averageRating: averageRating[0]?.avg || 0,
          // Also include organized structure
          usersByRole: {
            tourists: await User.countDocuments({ role: 'tourist' }),
            hosts: await User.countDocuments({ role: 'host' }),
            admins: await User.countDocuments({ role: 'admin' }),
            providers: totalProviders
          }
        }
      }
    });
  } catch (error) {
    next(error);
  }
};

// Delete review (admin)
export const deleteReview = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;

    const review = await Review.findById(id);
    if (!review) {
      return next(new AppError('Review not found', 404));
    }

    await review.deleteOne();

    res.json({
      success: true,
      message: 'Review deleted successfully'
    });
  } catch (error) {
    next(error);
  }
};

