import { Request, Response, NextFunction } from 'express';
import { uploadImage, uploadImages } from '../services/upload.service';
import { AppError } from '../middleware/error.middleware';

// Upload single image
export const uploadSingleImage = async (req: Request, res: Response, next: NextFunction) => {
  try {
    if (!req.file) {
      return next(new AppError('Please upload an image', 400));
    }

    const imageUrl = await uploadImage(req.file);

    res.status(200).json({
      success: true,
      url: imageUrl,
      message: 'Image uploaded successfully'
    });
  } catch (error) {
    next(error);
  }
};

// Upload multiple images
export const uploadMultipleImages = async (req: Request, res: Response, next: NextFunction) => {
  try {
    if (!req.files || !Array.isArray(req.files) || req.files.length === 0) {
      return next(new AppError('Please upload at least one image', 400));
    }

    const imageUrls = await uploadImages(req.files as Express.Multer.File[]);

    res.status(200).json({
      success: true,
      urls: imageUrls,
      message: 'Images uploaded successfully'
    });
  } catch (error) {
    next(error);
  }
};
