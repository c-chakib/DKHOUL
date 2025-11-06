import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';

let mongoServer: MongoMemoryServer;

// Setup MongoDB Memory Server for testing
// Allow longer startup time for in-memory MongoDB in CI/slow machines
jest.setTimeout(120000);

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create({
    instance: {
      storageEngine: 'wiredTiger',
    },
    binary: {
      // Increase download timeout for slow connections
      downloadDir: './node_modules/.cache/mongodb-memory-server/mongodb-binaries'
    }
  });
  const mongoUri = mongoServer.getUri();
  await mongoose.connect(mongoUri);
}, 120000); // 2-minute timeout for beforeAll

afterAll(async () => {
  await mongoose.disconnect();
  if (mongoServer) {
    // stop may be undefined if creation failed; guard to avoid crashing
    try {
      await mongoServer.stop();
    } catch (err) {
      // ignore
    }
  }
});

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
