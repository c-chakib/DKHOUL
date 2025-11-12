import mongoose from 'mongoose';
// import { MongoMemoryServer } from 'mongodb-memory-server';

// let mongoServer: MongoMemoryServer;

// Setup for testing without MongoDB Memory Server
// Allow longer startup time for tests
jest.setTimeout(120000);

// For now, skip database setup to allow unit tests to run
// TODO: Re-enable MongoDB Memory Server when installation issues are resolved

beforeAll(async () => {
  // Temporarily skip MongoDB setup for audit purposes
  console.log('Skipping MongoDB Memory Server setup for audit');
}, 180000);

afterAll(async () => {
  try {
    if (mongoose.connection.readyState !== 0) {
      await mongoose.disconnect();
    }
  } catch (err) {
    console.error('Error disconnecting mongoose:', err);
  }

  // if (mongoServer) {
  //   try {
  //     await mongoServer.stop({ doCleanup: true, force: true });
  //   } catch (err) {
  //     console.error('Error stopping mongo server:', err);
  //   }
  // }
}, 30000);

afterEach(async () => {
  const collections = mongoose.connection.collections;
  for (const key in collections) {
    await collections[key].deleteMany({});
  }
});

// Mock environment variables
process.env.JWT_SECRET = 'test-secret-key';
process.env.JWT_EXPIRE = '7d';
process.env.JWT_REFRESH_EXPIRE = '30d';
process.env.NODE_ENV = 'test';

// Mock upload service
jest.mock('../services/upload.service', () => ({
  uploadImage: jest.fn().mockResolvedValue('https://example.com/test-photo.jpg'),
  uploadImages: jest.fn().mockResolvedValue(['https://example.com/test-photo1.jpg', 'https://example.com/test-photo2.jpg']),
  deleteImage: jest.fn().mockResolvedValue(undefined)
}));
