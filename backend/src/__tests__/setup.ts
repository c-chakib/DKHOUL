import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';

let mongoServer: MongoMemoryServer;

// Setup MongoDB Memory Server for testing
// Allow longer startup time for in-memory MongoDB in CI/slow machines
jest.setTimeout(120000);

beforeAll(async () => {
  try {
    mongoServer = await MongoMemoryServer.create({
      instance: {
        storageEngine: 'wiredTiger',
      },
      binary: {
        version: '6.0.9', // Use specific stable version
        downloadDir: './node_modules/.cache/mongodb-memory-server/mongodb-binaries',
      },
    });
    const mongoUri = mongoServer.getUri();
    await mongoose.connect(mongoUri, {
      connectTimeoutMS: 30000,
      serverSelectionTimeoutMS: 30000,
    });
  } catch (error) {
    console.error('Failed to start MongoDB Memory Server:', error);
    throw error;
  }
}, 180000); // 3-minute timeout for beforeAll

afterAll(async () => {
  try {
    if (mongoose.connection.readyState !== 0) {
      await mongoose.disconnect();
    }
  } catch (err) {
    console.error('Error disconnecting mongoose:', err);
  }
  
  if (mongoServer) {
    try {
      await mongoServer.stop({ doCleanup: true, force: true });
    } catch (err) {
      console.error('Error stopping mongo server:', err);
    }
  }
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
