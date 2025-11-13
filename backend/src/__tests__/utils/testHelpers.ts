import jwt from 'jsonwebtoken';
// Mock User model directly to avoid mongoose issues
jest.mock('../../models/User.model', () => ({
  default: {
    create: jest.fn().mockImplementation((data) => Promise.resolve({
      ...data,
      _id: '507f1f77bcf86cd799439011',
      save: jest.fn().mockResolvedValue({ ...data, _id: '507f1f77bcf86cd799439011' }),
    })),
    findOne: jest.fn().mockImplementation((query) => ({
      select: jest.fn().mockReturnThis(),
      exec: jest.fn().mockResolvedValue(null),
    })),
    findById: jest.fn().mockImplementation((id) => ({
      select: jest.fn().mockReturnThis(),
      populate: jest.fn().mockReturnThis(),
      exec: jest.fn().mockResolvedValue(null),
    })),
  },
}));
import User from '../../models/User.model';
import Service from '../../models/Service.model';
import Booking from '../../models/Booking.model';

// Mock Message model
jest.mock('../../models/Message.model', () => ({
  default: {
    create: jest.fn().mockImplementation((data) => Promise.resolve({
      ...data,
      _id: '507f1f77bcf86cd799439012',
      save: jest.fn().mockResolvedValue({ ...data, _id: '507f1f77bcf86cd799439012' }),
    })),
    find: jest.fn().mockReturnThis(),
    findOne: jest.fn().mockReturnThis(),
    findById: jest.fn().mockReturnThis(),
    aggregate: jest.fn().mockResolvedValue([]),
    populate: jest.fn().mockReturnThis(),
    select: jest.fn().mockReturnThis(),
    sort: jest.fn().mockReturnThis(),
    limit: jest.fn().mockReturnThis(),
    skip: jest.fn().mockReturnThis(),
    exec: jest.fn().mockResolvedValue([]),
  },
}));

export const createTestUser = async (role: string = 'tourist') => {
  // Return a mock user object directly for testing
  const mockId = {
    toString: () => '507f1f77bcf86cd799439011',
    equals: (other: any) => '507f1f77bcf86cd799439011' === (other?.toString?.() || other),
  };

  return {
    _id: mockId,
    email: `test${Date.now()}@test.com`,
    password: 'password123',
    role,
    firstName: 'Test',
    lastName: 'User',
    photo: undefined,
    phoneNumber: '+212600000000',
    bio: undefined,
    address: undefined,
    city: undefined,
    country: undefined,
    languages: ['French', 'English'],
    verifiedProvider: false,
    profile: {
      firstName: 'Test',
      lastName: 'User',
      phone: '+212600000000',
      languages: ['French', 'English'],
      photo: undefined as string | undefined
    },
    emailVerified: true,
    isActive: true,
    notificationPreferences: {
      email: true,
      push: true,
      sms: false
    },
    save: jest.fn().mockResolvedValue(undefined)
  };
};

export const generateTestToken = (userId: string, email: string, role: string) => {
  // cast to any to avoid TypeScript overload confusion in tests
  return (jwt.sign as any)(
    { userId, email, role },
    process.env.JWT_SECRET as any,
    { expiresIn: process.env.JWT_EXPIRE }
  );
};

export const createTestService = async (hostId: string | { toString: () => string }) => {
  const hostIdStr = typeof hostId === 'string' ? hostId : hostId.toString();
  const mockId = {
    toString: () => '507f1f77bcf86cd799439012',
    equals: (other: any) => '507f1f77bcf86cd799439012' === (other?.toString?.() || other),
  };

  return {
    _id: mockId,
    hostId: hostIdStr,
    category: 'Space',
    title: 'Test Service for Testing',
    description: 'A comprehensive test service description that meets the minimum length requirement.',
    photos: [
      'https://example.com/photo1.jpg',
      'https://example.com/photo2.jpg',
      'https://example.com/photo3.jpg'
    ],
    pricing: {
      amount: 100,
      currency: 'MAD',
      priceType: 'per_day'
    },
    location: {
      type: 'Point',
      coordinates: [-7.9811, 31.6295],
      address: '123 Test St',
      city: 'Casablanca',
      region: 'Casablanca-Settat'
    },
    availability: [],
    capacity: 4,
    languages: ['French', 'English'],
    amenities: ['WiFi', 'Parking'],
    rating: {
      average: 4.5,
      count: 10
    },
    status: 'active',
    save: jest.fn().mockResolvedValue(undefined)
  };
};

export const createTestBooking = async (serviceId: string | { toString: () => string }, touristId: string | { toString: () => string }, hostId: string | { toString: () => string }) => {
  const serviceIdStr = typeof serviceId === 'string' ? serviceId : serviceId.toString();
  const touristIdStr = typeof touristId === 'string' ? touristId : touristId.toString();
  const hostIdStr = typeof hostId === 'string' ? hostId : hostId.toString();

  const mockId = {
    toString: () => '507f1f77bcf86cd799439013',
    equals: (other: any) => '507f1f77bcf86cd799439013' === (other?.toString?.() || other),
  };

  const bookingDate = new Date();
  bookingDate.setDate(bookingDate.getDate() + 7);

  return {
    _id: mockId,
    serviceId: serviceIdStr,
    touristId: touristIdStr,
    hostId: hostIdStr,
    bookingDate,
    timeSlot: {
      startTime: '09:00',
      endTime: '17:00'
    },
    numberOfGuests: 2,
    pricing: {
      baseAmount: 100,
      serviceFee: 10,
      totalAmount: 110,
      currency: 'MAD'
    },
    totalAmount: 110, // Add direct access for tests
    status: 'pending',
    save: jest.fn().mockResolvedValue(undefined)
  };
};

export const createTestReview = async (
  bookingId: string | { toString: () => string },
  serviceId: string | { toString: () => string },
  reviewerId: string | { toString: () => string },
  revieweeId: string | { toString: () => string },
  reviewerType: 'tourist' | 'host' = 'tourist',
  rating: number = 5
) => {
  const bookingIdStr = typeof bookingId === 'string' ? bookingId : bookingId.toString();
  const serviceIdStr = typeof serviceId === 'string' ? serviceId : serviceId.toString();
  const reviewerIdStr = typeof reviewerId === 'string' ? reviewerId : reviewerId.toString();
  const revieweeIdStr = typeof revieweeId === 'string' ? revieweeId : revieweeId.toString();

  const mockId = {
    toString: () => '507f1f77bcf86cd799439014',
    equals: (other: any) => '507f1f77bcf86cd799439014' === (other?.toString?.() || other),
  };

  const expiresAt = new Date();
  expiresAt.setDate(expiresAt.getDate() + 90); // Reviews expire after 90 days

  return {
    _id: mockId,
    bookingId: bookingIdStr,
    serviceId: serviceIdStr,
    reviewerId: reviewerIdStr,
    revieweeId: revieweeIdStr,
    reviewerType,
    ratings: {
      overall: rating,
      communication: rating,
      accuracy: rating,
      value: rating,
      cleanliness: rating
    },
    comment: 'This is a test review comment with sufficient length.',
    photos: [],
    expiresAt,
    save: jest.fn().mockResolvedValue(undefined)
  };
};
