import AWS from 'aws-sdk';
import { v4 as uuidv4 } from 'uuid';
import path from 'path';
import sharp from 'sharp';
import fs from 'fs';
import { s3, bucketName } from '../config/aws';

const isDevelopment = process.env.NODE_ENV !== 'production';
const uploadDir = path.join(process.cwd(), 'uploads', 'images');

// Ensure upload directory exists
if (isDevelopment) {
  if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
  }
}

// Upload single image
export const uploadImage = async (file: Express.Multer.File): Promise<string> => {
  try {
    // Process image with sharp (resize and optimize)
    const processedImage = await sharp(file.buffer)
      .resize(1200, 1200, {
        fit: 'inside',
        withoutEnlargement: true
      })
      .jpeg({ quality: 85 })
      .toBuffer();

    const fileExt = path.extname(file.originalname);
    const fileName = `${uuidv4()}${fileExt}`;

    if (isDevelopment) {
      // Save to local filesystem in development
      const filePath = path.join(uploadDir, fileName);
      await fs.promises.writeFile(filePath, processedImage);
      const imageUrl = `http://localhost:${process.env.PORT || 5000}/uploads/images/${fileName}`;
      console.log('✅ Image saved locally:', imageUrl);
      return imageUrl;
    } else {
      // Upload to S3 in production
      const key = `uploads/images/${fileName}`;
      await s3.upload({
        Bucket: bucketName,
        Key: key,
        Body: processedImage,
        ContentType: file.mimetype,
        ACL: 'public-read'
      }).promise();

      const imageUrl = `https://${bucketName}.s3.amazonaws.com/${key}`;
      console.log('✅ Image uploaded to S3:', imageUrl);
      return imageUrl;
    }
  } catch (error) {
    console.error('❌ Image upload failed:', error);
    throw new Error('Failed to upload image');
  }
};

// Upload multiple images
export const uploadImages = async (files: Express.Multer.File[]): Promise<string[]> => {
  try {
    const uploadPromises = files.map(file => uploadImage(file));
    const urls = await Promise.all(uploadPromises);
    return urls;
  } catch (error) {
    console.error('❌ Multiple images upload failed:', error);
    throw new Error('Failed to upload images');
  }
};

// Delete image from S3
export const deleteImage = async (imageUrl: string): Promise<void> => {
  try {
    // Extract key from URL
    const url = new URL(imageUrl);
    const key = url.pathname.substring(1); // Remove leading slash

    await s3.deleteObject({ Bucket: bucketName, Key: key }).promise();
    console.log('✅ Image deleted from S3:', key);
  } catch (error) {
    console.error('❌ Image deletion failed:', error);
    throw new Error('Failed to delete image');
  }
};

// Delete multiple images
export const deleteImages = async (imageUrls: string[]): Promise<void> => {
  try {
    const deletePromises = imageUrls.map(url => deleteImage(url));
    await Promise.all(deletePromises);
  } catch (error) {
    console.error('❌ Multiple images deletion failed:', error);
    throw new Error('Failed to delete images');
  }
};

// Upload file (for documents, PDFs, etc.)
export const uploadFile = async (file: Express.Multer.File): Promise<string> => {
  try {
    const fileExt = path.extname(file.originalname);
    const fileName = `${uuidv4()}${fileExt}`;
    const key = `uploads/files/${fileName}`;

    await s3.upload({
      Bucket: bucketName,
      Key: key,
      Body: file.buffer,
      ContentType: file.mimetype,
      ACL: 'public-read'
    }).promise();

    const fileUrl = `https://${bucketName}.s3.amazonaws.com/${key}`;
    return fileUrl;
  } catch (error) {
    console.error('❌ File upload failed:', error);
    throw new Error('Failed to upload file');
  }
};

// Get file size in MB
export const getFileSizeMB = (buffer: Buffer): number => {
  return buffer.length / (1024 * 1024);
};

// Validate image file
export const isValidImage = (mimetype: string): boolean => {
  const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
  return validTypes.includes(mimetype);
};

// Validate file size
export const isValidFileSize = (buffer: Buffer, maxSizeMB: number = 5): boolean => {
  return getFileSizeMB(buffer) <= maxSizeMB;
};

