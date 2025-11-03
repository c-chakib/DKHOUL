import { Request, Response, NextFunction } from 'express';
import Review from '../models/Review.model';
import Booking from '../models/Booking.model';
import Service from '../models/Service.model';
import { AppError } from '../middleware/error.middleware';

// Create review
export const createReview = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = (req as any).user.userId;
    const {
      bookingId,
      serviceId,
      reviewerType,
      overallRating,
      communicationRating,
      accuracyRating,
      valueRating,
      cleanlinessRating,
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
      if (booking.user.toString() !== userId) {
        return next(new AppError('Not authorized to review as guest', 403));
      }
    } else if (reviewerType === 'host') {
      if (service.provider.toString() !== userId) {
        return next(new AppError('Not authorized to review as host', 403));
      }
    }

    // Check if review already exists
    const existingReview = await Review.findOne({
      booking: bookingId,
      reviewerType
    });

    if (existingReview) {
      return next(new AppError('Review already submitted for this booking', 409));
    }

    // Create review
    const review = await Review.create({
      booking: bookingId,
      service: serviceId,
      reviewer: userId,
      reviewerType,
      ratings: {
        overall: overallRating,
        communication: communicationRating,
        accuracy: accuracyRating,
        value: valueRating,
        cleanliness: cleanlinessRating
      },
      comment
    });

    // Update service rating
    await updateServiceRating(serviceId);

    await review.populate('reviewer', 'firstName lastName photo');

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
    if (review.reviewer.toString() !== userId) {
      return next(new AppError('Not authorized to update this review', 403));
    }

    // Check if review is expired
    if (review.expiresAt && new Date() > review.expiresAt) {
      return next(new AppError('Review edit period has expired', 400));
    }

    // Update review
    const { overallRating, communicationRating, accuracyRating, valueRating, cleanlinessRating, comment } = req.body;

    if (overallRating) review.ratings.overall = overallRating;
    if (communicationRating) review.ratings.communication = communicationRating;
    if (accuracyRating) review.ratings.accuracy = accuracyRating;
    if (valueRating) review.ratings.value = valueRating;
    if (cleanlinessRating) review.ratings.cleanliness = cleanlinessRating;
    if (comment) review.comment = comment;

    await review.save();

    // Update service rating
    await updateServiceRating(review.service.toString());

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
    if (review.reviewer.toString() !== userId && userRole !== 'admin') {
      return next(new AppError('Not authorized to delete this review', 403));
    }

    const serviceId = review.service.toString();
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

    const review = await Review.findById(id).populate('service');
    if (!review) {
      return next(new AppError('Review not found', 404));
    }

    // Check if user is the service provider
    const service = await Service.findById(review.service);
    if (service?.provider.toString() !== userId) {
      return next(new AppError('Only service provider can respond to reviews', 403));
    }

    // Check if already responded
    if (review.hostResponse && review.hostResponse.comment) {
      return next(new AppError('Already responded to this review', 400));
    }

    review.hostResponse = {
      comment: response,
      respondedBy: userId,
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

