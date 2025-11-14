import multer from 'multer';
import multerS3 from 'multer-s3';
import { s3, bucketName } from '../config/aws';
import { v4 as uuidv4 } from 'uuid';
import path from 'path';
import { AppError } from './error.middleware';

// File filter for images
const imageFilter = (_req: any, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
  const allowedMimes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
  
  if (allowedMimes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    // Use AppError so our error handler returns 400 not 500
    cb(new AppError('Invalid file type. Only JPEG, PNG, GIF, and WebP are allowed.', 400));
  }
};

// Upload to S3
export const uploadToS3 = multer({
  storage: multerS3({
    s3: s3,
    bucket: bucketName!,
    acl: 'public-read',
    metadata: (_req: any, _file: any, cb: any) => {
      cb(null, { fieldName: _file.fieldname });
    },
    key: (_req: any, file: any, cb: any) => {
      const ext = path.extname(file.originalname);
      const filename = `${uuidv4()}${ext}`;
      const folder = file.fieldname === 'photo' ? 'profiles' : 'services';
      cb(null, `${folder}/${filename}`);
    }
  }),
  fileFilter: imageFilter,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB limit
  }
});

// Upload to memory (for development) - stores file in buffer
const memoryStorage = multer.memoryStorage();

export const uploadToMemory = multer({
  storage: memoryStorage,
  fileFilter: imageFilter,
  limits: {
    fileSize: 5 * 1024 * 1024
  }
});

// Default upload - use memory storage for both dev and prod
// The upload service will handle saving to S3 or local filesystem
export const upload = uploadToMemory;

