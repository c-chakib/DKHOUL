import { Request, Response, NextFunction } from 'express';
import Service from '../models/Service.model';
import { AppError } from '../middleware/error.middleware';
import { uploadImages, deleteImage } from '../services/upload.service';

// Get all services with filtering and pagination
export const getServices = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const {
      category,
      city,
      minPrice,
      maxPrice,
      minRating,
      search,
      status = 'active',
      page = '1',
      limit = '10',
      sort = '-createdAt'
    } = req.query;

    // Build query
    const query: any = { status };

    if (category) query.category = category;
    if (city) query.city = city;
    if (minPrice || maxPrice) {
      query.pricing = {};
      if (minPrice) query.pricing.$gte = Number(minPrice);
      if (maxPrice) query.pricing.$lte = Number(maxPrice);
    }
    if (minRating) query.rating = { $gte: Number(minRating) };
    if (search) {
      query.$text = { $search: search as string };
    }

    // Pagination
    const pageNum = parseInt(page as string);
    const limitNum = parseInt(limit as string);
    const skip = (pageNum - 1) * limitNum;

    // Execute query
    const services = await Service.find(query)
      .populate('provider', 'firstName lastName photo rating')
      .sort(sort as string)
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

// Get service by ID
export const getServiceById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;

    const service = await Service.findById(id)
      .populate('provider', 'firstName lastName photo rating verifiedProvider')
      .populate({
        path: 'reviews',
        populate: { path: 'reviewer', select: 'firstName lastName photo' },
        options: { sort: '-createdAt', limit: 5 }
      });

    if (!service) {
      return next(new AppError('Service not found', 404));
    }

    // Increment view count
    service.views = (service.views || 0) + 1;
    await service.save();

    res.json({
      success: true,
      data: { service }
    });
  } catch (error) {
    next(error);
  }
};

// Create service
export const createService = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = (req as any).user.userId;
    const serviceData = {
      ...req.body,
      provider: userId
    };

    // Handle photo uploads if present
    if (req.files && Array.isArray(req.files)) {
      const photoUrls = await uploadImages(req.files as Express.Multer.File[]);
      serviceData.photos = photoUrls;
    }

    const service = await Service.create(serviceData);

    res.status(201).json({
      success: true,
      message: 'Service created successfully',
      data: { service }
    });
  } catch (error) {
    next(error);
  }
};

// Update service
export const updateService = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const userId = (req as any).user.userId;

    const service = await Service.findById(id);
    if (!service) {
      return next(new AppError('Service not found', 404));
    }

    // Check ownership
    if (service.provider.toString() !== userId) {
      return next(new AppError('Not authorized to update this service', 403));
    }

    // Handle new photo uploads
    if (req.files && Array.isArray(req.files)) {
      const photoUrls = await uploadImages(req.files as Express.Multer.File[]);
      req.body.photos = [...(service.photos || []), ...photoUrls];
    }

    Object.assign(service, req.body);
    await service.save();

    res.json({
      success: true,
      message: 'Service updated successfully',
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
    const userId = (req as any).user.userId;
    const userRole = (req as any).user.role;

    const service = await Service.findById(id);
    if (!service) {
      return next(new AppError('Service not found', 404));
    }

    // Check ownership or admin
    if (service.provider.toString() !== userId && userRole !== 'admin') {
      return next(new AppError('Not authorized to delete this service', 403));
    }

    // Delete associated photos
    if (service.photos && service.photos.length > 0) {
      await Promise.all(service.photos.map(photo => deleteImage(photo)));
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

// Delete service photo
export const deleteServicePhoto = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const { photoUrl } = req.body;
    const userId = (req as any).user.userId;

    const service = await Service.findById(id);
    if (!service) {
      return next(new AppError('Service not found', 404));
    }

    // Check ownership
    if (service.provider.toString() !== userId) {
      return next(new AppError('Not authorized to modify this service', 403));
    }

    // Remove photo from array
    service.photos = service.photos?.filter(photo => photo !== photoUrl) || [];
    await service.save();

    // Delete from storage
    await deleteImage(photoUrl);

    res.json({
      success: true,
      message: 'Photo deleted successfully',
      data: { service }
    });
  } catch (error) {
    next(error);
  }
};

// Search services by location (geospatial)
export const searchByLocation = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { longitude, latitude, maxDistance = '10000' } = req.query; // maxDistance in meters

    if (!longitude || !latitude) {
      return next(new AppError('Longitude and latitude are required', 400));
    }

    const services = await Service.find({
      location: {
        $near: {
          $geometry: {
            type: 'Point',
            coordinates: [parseFloat(longitude as string), parseFloat(latitude as string)]
          },
          $maxDistance: parseInt(maxDistance as string)
        }
      },
      status: 'active'
    }).populate('provider', 'firstName lastName photo rating');

    res.json({
      success: true,
      data: { services }
    });
  } catch (error) {
    next(error);
  }
};

// Get provider's services
export const getProviderServices = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { providerId } = req.params;
    const { status } = req.query;

    const query: any = { provider: providerId };
    if (status) query.status = status;

    const services = await Service.find(query).sort('-createdAt');

    res.json({
      success: true,
      data: { services }
    });
  } catch (error) {
    next(error);
  }
};

// Toggle service availability
export const toggleAvailability = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const userId = (req as any).user.userId;

    const service = await Service.findById(id);
    if (!service) {
      return next(new AppError('Service not found', 404));
    }

    // Check ownership
    if (service.provider.toString() !== userId) {
      return next(new AppError('Not authorized to modify this service', 403));
    }

    service.isAvailable = !service.isAvailable;
    await service.save();

    res.json({
      success: true,
      message: `Service ${service.isAvailable ? 'activated' : 'deactivated'} successfully`,
      data: { service }
    });
  } catch (error) {
    next(error);
  }
};

