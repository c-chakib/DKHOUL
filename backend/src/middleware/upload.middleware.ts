import multer from 'multer';
import multerS3 from 'multer-s3';
import { s3, bucketName } from '../config/aws';
import { v4 as uuidv4 } from 'uuid';
import path from 'path';
import fs from 'fs';
import { AppError } from './error.middleware';

// File filter for images
const imageFilter = (req: any, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
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
    metadata: (req: any, file: any, cb: any) => {
      cb(null, { fieldName: file.fieldname });
    },
    key: (req: any, file: any, cb: any) => {
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

// Upload to local storage (for development)
const localStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    const dir = 'uploads/';
    try {
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }
    } catch (e) {
      return cb(e as any, dir);
    }
    cb(null, dir);
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    const filename = `${uuidv4()}${ext}`;
    cb(null, filename);
  }
});

export const uploadToLocal = multer({
  storage: localStorage,
  fileFilter: imageFilter,
  limits: {
    fileSize: 5 * 1024 * 1024
  }
});

// Default upload (use S3 in production, local in development)
export const upload = process.env.NODE_ENV === 'production' ? uploadToS3 : uploadToLocal;

