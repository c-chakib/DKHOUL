import { Request, Response, NextFunction } from 'express';
import Review from '../models/Review.model';
import Booking from '../models/Booking.model';
import Service from '../models/Service.model';
import { AppError } from '../middleware/error.middleware';
import { getObjectIdString } from '../utils/helpers';

// Create review
export const createReview = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = (req as any).user.userId;
    const {
      bookingId,
      serviceId,
      reviewerType,
      ratings,
      comment
    } = req.body;

    // Verify booking exists and is completed
    const booking = await Booking.findById(bookingId);
    if (!booking) {
      return next(new AppError('Booking not found', 404));
    }

    if (booking.status !== 'completed') {
      return next(new AppError('Can only review completed bookings', 400));
    }

    // Check authorization based on reviewer type
    const service = await Service.findById(serviceId);
    if (!service) {
      return next(new AppError('Service not found', 404));
    }

    if (reviewerType === 'guest') {
      if (getObjectIdString(booking.touristId) !== userId) {
        return next(new AppError('Not authorized to review as guest', 403));
      }
    } else if (reviewerType === 'host') {
      if (getObjectIdString(service.hostId) !== userId) {
        return next(new AppError('Not authorized to review as host', 403));
      }
    }

    // Check if review already exists
    const existingReview = await Review.findOne({
      bookingId: bookingId,
      reviewerType
    });

    if (existingReview) {
      return next(new AppError('Review already submitted for this booking', 409));
    }

    // Determine reviewee (the person being reviewed)
    const revieweeId = reviewerType === 'guest' ? service.hostId : booking.touristId;

    // Create review with expiration (30 days to edit)
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 30);

    const review = await Review.create({
      bookingId,
      serviceId,
      reviewerId: userId,
      revieweeId,
      reviewerType,
      ratings: {
        overall: ratings.overall,
        communication: ratings.communication,
        accuracy: ratings.accuracy,
        value: ratings.value,
        cleanliness: ratings.cleanliness
      },
      comment,
      expiresAt
    });

    // Update service rating
    await updateServiceRating(serviceId);

    await review.populate('reviewerId', 'profile.firstName profile.lastName profile.photo');

    res.status(201).json({
      success: true,
      message: 'Review submitted successfully',
      data: { review }
    });
  } catch (error) {
    next(error);
  }
};

// Get service reviews
export const getServiceReviews = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { serviceId } = req.params;
    const { page = '1', limit = '10', sort = '-createdAt' } = req.query;

    const pageNum = parseInt(page as string);
    const limitNum = parseInt(limit as string);
    const skip = (pageNum - 1) * limitNum;

    const reviews = await Review.find({
      service: serviceId,
      reviewerType: 'guest'
    })
      .populate('reviewer', 'firstName lastName photo')
      .populate('hostResponse.respondedBy', 'firstName lastName')
      .sort(sort as string)
      .skip(skip)
      .limit(limitNum);

    const total = await Review.countDocuments({ service: serviceId, reviewerType: 'guest' });

    // Calculate average ratings
    const avgRatings = await Review.aggregate([
      { $match: { service: serviceId, reviewerType: 'guest' } },
      {
        $group: {
          _id: null,
          overall: { $avg: '$ratings.overall' },
          communication: { $avg: '$ratings.communication' },
          accuracy: { $avg: '$ratings.accuracy' },
          value: { $avg: '$ratings.value' },
          cleanliness: { $avg: '$ratings.cleanliness' }
        }
      }
    ]);

    res.json({
      success: true,
      data: {
        reviews,
        averageRatings: avgRatings[0] || null,
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

// Get review by ID
export const getReviewById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;

    const review = await Review.findById(id)
      .populate('reviewer', 'firstName lastName photo')
      .populate('service', 'title photos')
      .populate('booking');

    if (!review) {
      return next(new AppError('Review not found', 404));
    }

    res.json({
      success: true,
      data: { review }
    });
  } catch (error) {
    next(error);
  }
};

// Update review
export const updateReview = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const userId = (req as any).user.userId;

    const review = await Review.findById(id);
    if (!review) {
      return next(new AppError('Review not found', 404));
    }

    // Check authorization
    if (getObjectIdString(review.reviewerId) !== userId) {
      return next(new AppError('Not authorized to update this review', 403));
    }

    // Check if review is expired
    if (review.expiresAt && new Date() > review.expiresAt) {
      return next(new AppError('Review edit period has expired', 400));
    }

    // Update review
    const { ratings, comment } = req.body;

    if (ratings) {
      if (ratings.overall) review.ratings.overall = ratings.overall;
      if (ratings.communication) review.ratings.communication = ratings.communication;
      if (ratings.accuracy) review.ratings.accuracy = ratings.accuracy;
      if (ratings.value) review.ratings.value = ratings.value;
      if (ratings.cleanliness) review.ratings.cleanliness = ratings.cleanliness;
    }
    if (comment) review.comment = comment;

    await review.save();

    // Update service rating
    await updateServiceRating(review.serviceId.toString());

    res.json({
      success: true,
      message: 'Review updated successfully',
      data: { review }
    });
  } catch (error) {
    next(error);
  }
};

// Delete review
export const deleteReview = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const userId = (req as any).user.userId;
    const userRole = (req as any).user.role;

    const review = await Review.findById(id);
    if (!review) {
      return next(new AppError('Review not found', 404));
    }

    // Check authorization
    if (getObjectIdString(review.reviewerId) !== userId && userRole !== 'admin') {
      return next(new AppError('Not authorized to delete this review', 403));
    }

    const serviceId = review.serviceId.toString();
    await review.deleteOne();

    // Update service rating
    await updateServiceRating(serviceId);

    res.json({
      success: true,
      message: 'Review deleted successfully'
    });
  } catch (error) {
    next(error);
  }
};

// Host response to review
export const respondToReview = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const { response } = req.body;
    const userId = (req as any).user.userId;

    const review = await Review.findById(id).populate('serviceId');
    if (!review) {
      return next(new AppError('Review not found', 404));
    }

    // Check if user is the service provider
    const service = await Service.findById(review.serviceId);
    if (getObjectIdString(service?.hostId) !== userId) {
      return next(new AppError('Only service provider can respond to reviews', 403));
    }

    // Check if already responded
    if (review.response && review.response.text) {
      return next(new AppError('Already responded to this review', 400));
    }

    review.response = {
      text: response,
      respondedAt: new Date()
    };

    await review.save();

    res.json({
      success: true,
      message: 'Response submitted successfully',
      data: { review }
    });
  } catch (error) {
    next(error);
  }
};

// Helper function to update service rating
async function updateServiceRating(serviceId: string) {
  const reviews = await Review.find({
    service: serviceId,
    reviewerType: 'guest'
  });

  if (reviews.length === 0) {
    await Service.findByIdAndUpdate(serviceId, {
      rating: 0,
      reviewCount: 0
    });
    return;
  }

  const totalRating = reviews.reduce((sum, review) => sum + review.ratings.overall, 0);
  const averageRating = totalRating / reviews.length;

  await Service.findByIdAndUpdate(serviceId, {
    rating: Math.round(averageRating * 10) / 10,
    reviewCount: reviews.length
  });
}

