import mongoose from 'mongoose';

// Setup for testing - prevent database connections
jest.setTimeout(60000);

// Mock mongoose completely to prevent any database operations
jest.mock('mongoose', () => {
  const mockSchema = function(this: any, definition?: any) {
    this.definition = definition;
    this.pre = jest.fn().mockReturnThis();
    this.post = jest.fn().mockReturnThis();
    this.virtual = jest.fn().mockReturnValue({
      get: jest.fn().mockReturnThis(),
      set: jest.fn().mockReturnThis(),
    });
    this.index = jest.fn().mockReturnThis();
    this.plugin = jest.fn().mockReturnThis();
    this.set = jest.fn().mockReturnThis();
    this.methods = {};
    this.statics = {};
  };

  // Add Types to the Schema constructor
  mockSchema.Types = {
    ObjectId: jest.fn().mockImplementation((id?: string) => ({
      toString: () => id || '507f1f77bcf86cd799439011',
      equals: (other: any) => (id || '507f1f77bcf86cd799439011') === (other?.toString?.() || other),
    })),
  };

  // Also add Types to the Schema prototype so it's accessible as Schema.Types
  mockSchema.prototype.Types = mockSchema.Types;

  const mockModel = {
    find: jest.fn().mockReturnValue({
      populate: jest.fn().mockReturnThis(),
      select: jest.fn().mockReturnThis(),
      sort: jest.fn().mockReturnThis(),
      limit: jest.fn().mockReturnThis(),
      skip: jest.fn().mockReturnThis(),
      exec: jest.fn().mockResolvedValue([]),
    }),
    findOne: jest.fn().mockReturnValue({
      populate: jest.fn().mockReturnThis(),
      select: jest.fn().mockReturnThis(),
      exec: jest.fn().mockResolvedValue(null),
    }),
    findById: jest.fn().mockReturnValue({
      populate: jest.fn().mockReturnThis(),
      select: jest.fn().mockReturnThis(),
      exec: jest.fn().mockResolvedValue(null),
    }),
    create: jest.fn().mockImplementation((data: any) => Promise.resolve({
      ...data,
      _id: mockSchema.Types.ObjectId(),
      save: jest.fn().mockResolvedValue({ ...data, _id: mockSchema.Types.ObjectId() }),
    })),
    updateOne: jest.fn().mockResolvedValue({ acknowledged: true, modifiedCount: 1 }),
    deleteOne: jest.fn().mockResolvedValue({ acknowledged: true, deletedCount: 1 }),
    findOneAndUpdate: jest.fn().mockResolvedValue(null),
    findOneAndDelete: jest.fn().mockResolvedValue(null),
    countDocuments: jest.fn().mockResolvedValue(0),
    aggregate: jest.fn().mockResolvedValue([]),
    save: jest.fn().mockResolvedValue({}),
    exec: jest.fn().mockResolvedValue([]),
  };

  return {
    connect: jest.fn().mockResolvedValue(undefined),
    disconnect: jest.fn().mockResolvedValue(undefined),
    connection: {
      readyState: 1,
      collections: {},
    },
    Schema: mockSchema,
    Types: {
      ObjectId: mockSchema.Types.ObjectId,
    },
    model: jest.fn().mockReturnValue(mockModel),
  };
});

// Mock environment variables
process.env.JWT_SECRET = 'test-secret-key-for-jwt';
process.env.JWT_EXPIRE = '7d';
process.env.JWT_REFRESH_EXPIRE = '30d';
process.env.NODE_ENV = 'test';
process.env.MONGODB_URI = 'mongodb://localhost:27017/test';

// Mock external services
jest.mock('../services/email.service', () => ({
  sendEmail: jest.fn().mockResolvedValue(true),
  sendWelcomeEmail: jest.fn().mockResolvedValue(true),
  sendPasswordResetEmail: jest.fn().mockResolvedValue(true),
}));

jest.mock('../config/aws', () => ({
  s3: {
    upload: jest.fn().mockResolvedValue({ Location: 'https://test-bucket.s3.amazonaws.com/test.jpg' }),
    deleteObject: jest.fn().mockResolvedValue({}),
  },
  bucketName: 'test-bucket',
}));

// Mock upload service
jest.mock('../services/upload.service', () => ({
  uploadImage: jest.fn().mockResolvedValue('https://test-bucket.s3.amazonaws.com/test.jpg'),
  uploadImages: jest.fn().mockResolvedValue(['https://test-bucket.s3.amazonaws.com/test1.jpg']),
  deleteImage: jest.fn().mockResolvedValue(undefined),
}));

// Mock Redis
jest.mock('../config/redis', () => ({
  get: jest.fn().mockResolvedValue(null),
  set: jest.fn().mockResolvedValue('OK'),
  del: jest.fn().mockResolvedValue(1),
}));

// Mock SendGrid
jest.mock('@sendgrid/mail', () => ({
  setApiKey: jest.fn(),
  send: jest.fn().mockResolvedValue([{ statusCode: 202 }]),
}));

// Suppress console logs during tests
const originalConsoleLog = console.log;
const originalConsoleError = console.error;

beforeAll(() => {
  console.log = jest.fn();
  console.error = jest.fn();
});

afterAll(() => {
  console.log = originalConsoleLog;
  console.error = originalConsoleError;
});
