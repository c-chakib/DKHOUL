import { Request, Response, NextFunction } from 'express';
import Booking from '../models/Booking.model';
import Service from '../models/Service.model';
import Payment from '../models/Payment.model';
import { AppError } from '../middleware/error.middleware';
import { calculateServiceFee, getObjectIdString } from '../utils/helpers';

// Create booking
export const createBooking = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = (req as any).user.userId;
    const { serviceId, bookingDate, numberOfGuests, timeSlot } = req.body;

    // Get service
    const service = await Service.findById(serviceId);
    if (!service) {
      return next(new AppError('Service not found', 404));
    }

    // Check if service is available
    if (service.status !== 'active') {
      return next(new AppError('Service is not available for booking', 400));
    }

    // Check if provider is trying to book their own service
    if (service.hostId.toString() === userId) {
      return next(new AppError('Cannot book your own service', 400));
    }

    // Calculate pricing - service.pricing is an object with amount
    const baseAmount = service.pricing.amount;
    const serviceFee = calculateServiceFee(baseAmount);
    const totalAmount = baseAmount + serviceFee;

    // Create booking
    const booking = await Booking.create({
      serviceId,
      touristId: userId,
      hostId: service.hostId,
      bookingDate,
      timeSlot: {
        startTime: timeSlot?.startTime || '09:00',
        endTime: timeSlot?.endTime || '17:00'
      },
      numberOfGuests: numberOfGuests || 1,
      pricing: {
        baseAmount,
        serviceFee,
        totalAmount,
        currency: service.pricing.currency || 'MAD'
      },
      status: 'pending'
    });

    res.status(201).json({
      success: true,
      message: 'Booking created successfully',
      data: { booking }
    });
  } catch (error) {
    next(error);
  }
};

// Get user's bookings
export const getMyBookings = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = (req as any).user.userId;
    const { status, page = '1', limit = '10' } = req.query;

    const query: any = { touristId: userId };
    if (status) query.status = status;

    const pageNum = parseInt(page as string);
    const limitNum = parseInt(limit as string);
    const skip = (pageNum - 1) * limitNum;

    const bookings = await Booking.find(query)
      .populate('serviceId', 'title photos pricing category hostId')
      .populate('hostId', 'profile.firstName profile.lastName')
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

// Get provider's bookings
export const getProviderBookings = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = (req as any).user.userId;
    const { status, page = '1', limit = '10' } = req.query;

    // Get services by provider
    const services = await Service.find({ provider: userId }).select('_id');
    const serviceIds = services.map(s => s._id);

    const query: any = { service: { $in: serviceIds } };
    if (status) query.status = status;

    const pageNum = parseInt(page as string);
    const limitNum = parseInt(limit as string);
    const skip = (pageNum - 1) * limitNum;

    const bookings = await Booking.find(query)
      .populate('service', 'title photos pricing category')
      .populate('user', 'firstName lastName email photo')
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

// Get booking by ID
export const getBookingById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const userId = (req as any).user.userId;

    const booking = await Booking.findById(id)
      .populate('serviceId')
      .populate('touristId', 'profile.firstName profile.lastName email profile.photo profile.phone')
      .populate('hostId', 'profile.firstName profile.lastName email profile.photo profile.phone')
      .populate('paymentId');

    if (!booking) {
      return next(new AppError('Booking not found', 404));
    }

    // Check authorization - user must be tourist, host, or admin
    // Handle both populated (object with _id) and non-populated (ObjectId) cases
    const touristIdStr = booking.touristId?._id?.toString() || booking.touristId?.toString();
    const hostIdStr = booking.hostId?._id?.toString() || booking.hostId?.toString();
    const isTourist = touristIdStr === userId;
    const isHost = hostIdStr === userId;
    const isAdmin = (req as any).user.role === 'admin';
    
    if (!isTourist && !isHost && !isAdmin) {
      return next(new AppError('Not authorized to view this booking', 403));
    }

    res.json({
      success: true,
      data: { booking }
    });
  } catch (error) {
    next(error);
  }
};

// Update booking status (provider action)
export const updateBookingStatus = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    const userId = (req as any).user.userId;

    const booking = await Booking.findById(id);
    if (!booking) {
      return next(new AppError('Booking not found', 404));
    }

    // Check if user is the host
    const hostIdStr = getObjectIdString(booking.hostId);
    if (hostIdStr !== userId) {
      return next(new AppError('Not authorized to update this booking', 403));
    }

    // Validate status transitions
    const validTransitions: any = {
      pending: ['confirmed', 'rejected', 'cancelled'],
      confirmed: ['in_progress', 'cancelled'],
      rejected: [],
      in_progress: ['completed', 'cancelled'],
      completed: [],
      cancelled: []
    };

    if (!validTransitions[booking.status]?.includes(status)) {
      return next(new AppError(`Cannot transition from ${booking.status} to ${status}`, 400));
    }

    booking.status = status;
    await booking.save();

    res.json({
      success: true,
      message: 'Booking status updated successfully',
      data: { booking }
    });
  } catch (error) {
    next(error);
  }
};

// Cancel booking (user action)
export const cancelBooking = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const userId = (req as any).user.userId;
    const { reason } = req.body;

    const booking = await Booking.findById(id);
    if (!booking) {
      return next(new AppError('Booking not found', 404));
    }

    // Check authorization
    if (booking.touristId.toString() !== userId) {
      return next(new AppError('Not authorized to cancel this booking', 403));
    }

    // Check if booking can be cancelled
    if (!['pending', 'confirmed'].includes(booking.status)) {
      return next(new AppError('This booking cannot be cancelled', 400));
    }

    // Check cancellation deadline (e.g., 24 hours before start)
    const now = new Date();
    const bookingDate = new Date(booking.bookingDate);
    const hoursUntilStart = (bookingDate.getTime() - now.getTime()) / (1000 * 60 * 60);

    if (hoursUntilStart < 24) {
      return next(new AppError('Cannot cancel within 24 hours of start time', 400));
    }

    booking.status = 'cancelled';
    booking.cancellationReason = reason;
    await booking.save();

    // Process refund if payment was made
    const payment = await Payment.findOne({ booking: booking._id });
    if (payment && payment.status === 'completed') {
      payment.status = 'refunded';
      await payment.save();
    }

    res.json({
      success: true,
      message: 'Booking cancelled successfully',
      data: { booking }
    });
  } catch (error) {
    next(error);
  }
};

// Get booking statistics (admin/provider)
export const getBookingStats = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = (req as any).user.userId;
    const userRole = (req as any).user.role;

    let matchQuery: any = {};

    // If provider, filter by their services
    if (userRole === 'provider') {
      const services = await Service.find({ provider: userId }).select('_id');
      const serviceIds = services.map(s => s._id);
      matchQuery = { service: { $in: serviceIds } };
    }

    const stats = await Booking.aggregate([
      { $match: matchQuery },
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 },
          totalAmount: { $sum: '$totalAmount' }
        }
      }
    ]);

    const totalBookings = await Booking.countDocuments(matchQuery);
    const totalRevenue = await Booking.aggregate([
      { $match: { ...matchQuery, status: 'completed' } },
      { $group: { _id: null, total: { $sum: '$totalAmount' } } }
    ]);

    res.json({
      success: true,
      data: {
        stats,
        totalBookings,
        totalRevenue: totalRevenue[0]?.total || 0
      }
    });
  } catch (error) {
    next(error);
  }
};

