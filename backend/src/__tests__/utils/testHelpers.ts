import jwt from 'jsonwebtoken';
import User from '../../models/User.model';
import Service from '../../models/Service.model';
import Booking from '../../models/Booking.model';

export const createTestUser = async (role: string = 'tourist') => {
  const userData = {
    email: `test${Date.now()}@test.com`,
    password: 'password123',
    role,
    profile: {
      firstName: 'Test',
      lastName: 'User',
      phone: '+212600000000',
      languages: ['French', 'English']
    },
    emailVerified: true,
    isActive: true,
    notificationPreferences: {
      email: true,
      push: true,
      sms: false
    }
  };
  
  return await User.create(userData);
};

export const generateTestToken = (userId: string, email: string, role: string) => {
  // cast to any to avoid TypeScript overload confusion in tests
  return (jwt.sign as any)(
    { userId, email, role },
    process.env.JWT_SECRET as any,
    { expiresIn: process.env.JWT_EXPIRE }
  );
};

export const createTestService = async (hostId: string) => {
  return await Service.create({
    hostId,
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
    status: 'active'
  });
};

export const createTestBooking = async (serviceId: string, touristId: string, hostId: string) => {
  const bookingDate = new Date();
  bookingDate.setDate(bookingDate.getDate() + 7);
  
  return await Booking.create({
    serviceId,
    touristId,
    hostId,
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
    status: 'pending'
  });
};

export const createTestReview = async (
  bookingId: string,
  serviceId: string,
  reviewerId: string,
  revieweeId: string,
  reviewerType: 'tourist' | 'host' = 'tourist',
  rating: number = 5
) => {
  const Review = require('../../models/Review.model').default;
  const expiresAt = new Date();
  expiresAt.setDate(expiresAt.getDate() + 90); // Reviews expire after 90 days
  
  return await Review.create({
    bookingId,
    serviceId,
    reviewerId,
    revieweeId,
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
    expiresAt
  });
};
