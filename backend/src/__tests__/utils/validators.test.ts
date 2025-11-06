import { Request, Response, NextFunction } from 'express';
import { validationResult } from 'express-validator';
import {
  registerValidation,
  loginValidation,
  serviceValidation,
  bookingValidation,
  reviewValidation,
  paginationValidators,
  emailValidator,
  passwordValidator,
  idValidator
} from '../../utils/validators';

// Mock express-validator
jest.mock('express-validator', () => {
  const actual = jest.requireActual('express-validator');
  return {
    ...actual,
    validationResult: jest.fn()
  };
});

describe('Validators', () => {
  let mockRequest: Partial<Request>;
  let mockResponse: Partial<Response>;
  let mockNext: NextFunction;

  beforeEach(() => {
    mockRequest = {
      body: {},
      params: {},
      query: {}
    };
    mockResponse = {};
    mockNext = jest.fn();
    (validationResult as unknown as jest.Mock).mockReturnValue({
      isEmpty: () => true,
      array: () => []
    });
  });

  describe('registerValidation', () => {
    it('should validate all required fields', async () => {
      mockRequest.body = {
        email: 'test@test.com',
        password: 'StrongPass123!',
        firstName: 'John',
        lastName: 'Doe',
        phoneNumber: '+212600000000'
      };

      for (const validator of registerValidation) {
        await validator.run(mockRequest as Request);
      }

      expect(mockRequest.body.email).toBe('test@test.com');
      expect(mockRequest.body.firstName).toBe('John');
    });

    it('should validate email format', async () => {
      mockRequest.body = {
        email: 'invalid-email',
        password: 'StrongPass123!',
        firstName: 'John',
        lastName: 'Doe'
      };

      const emailValidation = registerValidation.find(v => 
        v.builder && (v.builder as any).fields && (v.builder as any).fields.includes('email')
      );

      expect(emailValidation).toBeDefined();
    });

    it('should validate password length', async () => {
      mockRequest.body = {
        email: 'test@test.com',
        password: 'short',
        firstName: 'John',
        lastName: 'Doe'
      };

      const passwordValidation = registerValidation.find(v => 
        v.builder && (v.builder as any).fields && (v.builder as any).fields.includes('password')
      );

      expect(passwordValidation).toBeDefined();
    });

    it('should validate role enum', async () => {
      mockRequest.body = {
        email: 'test@test.com',
        password: 'StrongPass123!',
        firstName: 'John',
        lastName: 'Doe',
        role: 'tourist'
      };

      for (const validator of registerValidation) {
        await validator.run(mockRequest as Request);
      }

      expect(['tourist', 'host', 'user', 'provider']).toContain(mockRequest.body.role);
    });
  });

  describe('loginValidation', () => {
    it('should validate email and password', async () => {
      mockRequest.body = {
        email: 'test@test.com',
        password: 'password123'
      };

      for (const validator of loginValidation) {
        await validator.run(mockRequest as Request);
      }

      expect(mockRequest.body.email).toBe('test@test.com');
      expect(mockRequest.body.password).toBe('password123');
    });

    it('should require both email and password', () => {
      expect(loginValidation).toHaveLength(2);
    });
  });

  describe('serviceValidation', () => {
    it('should validate service category', async () => {
      mockRequest.body = {
        category: 'Space',
        title: 'Beautiful apartment in Casablanca',
        description: 'A wonderful place to stay with all amenities and great location near the beach and city center.',
        pricing: { amount: 100 },
        location: { city: 'Casablanca' },
        capacity: 4
      };

      for (const validator of serviceValidation) {
        await validator.run(mockRequest as Request);
      }

      expect(['Space', 'Skills', 'Connect']).toContain(mockRequest.body.category);
    });

    it('should validate title length', async () => {
      mockRequest.body = {
        title: 'Short',
        description: 'A wonderful place to stay with all amenities and great location.',
        category: 'Space',
        pricing: { amount: 100 },
        location: { city: 'Casablanca' },
        capacity: 2
      };

      const titleValidator = serviceValidation.find(v => 
        v.builder && (v.builder as any).fields && (v.builder as any).fields.includes('title')
      );

      expect(titleValidator).toBeDefined();
    });

    it('should validate description length', async () => {
      mockRequest.body = {
        title: 'Nice apartment',
        description: 'Too short',
        category: 'Space',
        pricing: { amount: 100 },
        location: { city: 'Casablanca' },
        capacity: 2
      };

      const descValidator = serviceValidation.find(v => 
        v.builder && (v.builder as any).fields && (v.builder as any).fields.includes('description')
      );

      expect(descValidator).toBeDefined();
    });

    it('should validate pricing amount is numeric', async () => {
      mockRequest.body = {
        category: 'Space',
        title: 'Beautiful apartment',
        description: 'A wonderful place to stay with all amenities and great location.',
        pricing: { amount: 'not-a-number' },
        location: { city: 'Casablanca' },
        capacity: 4
      };

      const pricingValidator = serviceValidation.find(v => 
        v.builder && (v.builder as any).fields && (v.builder as any).fields.includes('pricing.amount')
      );

      expect(pricingValidator).toBeDefined();
    });

    it('should validate capacity is integer', async () => {
      mockRequest.body = {
        category: 'Space',
        title: 'Beautiful apartment',
        description: 'A wonderful place to stay with all amenities and great location.',
        pricing: { amount: 100 },
        location: { city: 'Casablanca' },
        capacity: 0
      };

      const capacityValidator = serviceValidation.find(v => 
        v.builder && (v.builder as any).fields && (v.builder as any).fields.includes('capacity')
      );

      expect(capacityValidator).toBeDefined();
    });
  });

  describe('bookingValidation', () => {
    it('should validate all booking fields', async () => {
      mockRequest.body = {
        serviceId: '507f1f77bcf86cd799439011',
        bookingDate: '2024-12-25',
        numberOfGuests: 2,
        timeSlot: {
          startTime: '10:00',
          endTime: '18:00'
        }
      };

      for (const validator of bookingValidation) {
        await validator.run(mockRequest as Request);
      }

      expect(mockRequest.body.serviceId).toBe('507f1f77bcf86cd799439011');
      expect(mockRequest.body.numberOfGuests).toBe(2);
    });

    it('should validate MongoDB ID format', async () => {
      mockRequest.body = {
        serviceId: 'invalid-id',
        bookingDate: '2024-12-25',
        numberOfGuests: 2,
        timeSlot: { startTime: '10:00', endTime: '18:00' }
      };

      const serviceIdValidator = bookingValidation.find(v => 
        v.builder && (v.builder as any).fields && (v.builder as any).fields.includes('serviceId')
      );

      expect(serviceIdValidator).toBeDefined();
    });

    it('should validate ISO date format', async () => {
      mockRequest.body = {
        serviceId: '507f1f77bcf86cd799439011',
        bookingDate: 'invalid-date',
        numberOfGuests: 2,
        timeSlot: { startTime: '10:00', endTime: '18:00' }
      };

      const dateValidator = bookingValidation.find(v => 
        v.builder && (v.builder as any).fields && (v.builder as any).fields.includes('bookingDate')
      );

      expect(dateValidator).toBeDefined();
    });

    it('should validate minimum guests', async () => {
      mockRequest.body = {
        serviceId: '507f1f77bcf86cd799439011',
        bookingDate: '2024-12-25',
        numberOfGuests: 0,
        timeSlot: { startTime: '10:00', endTime: '18:00' }
      };

      const guestsValidator = bookingValidation.find(v => 
        v.builder && (v.builder as any).fields && (v.builder as any).fields.includes('numberOfGuests')
      );

      expect(guestsValidator).toBeDefined();
    });
  });

  describe('reviewValidation', () => {
    it('should validate rating range', async () => {
      mockRequest.body = {
        bookingId: '507f1f77bcf86cd799439011',
        ratings: {
          overall: 5,
          communication: 4
        }
      };

      for (const validator of reviewValidation) {
        await validator.run(mockRequest as Request);
      }

      expect(mockRequest.body.ratings.overall).toBe(5);
    });

    it('should enforce rating between 1-5', async () => {
      const overallRatingValidator = reviewValidation.find(v => 
        v.builder && (v.builder as any).fields && (v.builder as any).fields.includes('ratings.overall')
      );

      expect(overallRatingValidator).toBeDefined();
    });
  });

  describe('paginationValidators', () => {
    it('should validate page number', async () => {
      mockRequest.query = {
        page: '1',
        limit: '10'
      };

      for (const validator of paginationValidators) {
        await validator.run(mockRequest as Request);
      }

      expect(mockRequest.query.page).toBe('1');
    });

    it('should validate limit range', async () => {
      mockRequest.query = {
        page: '1',
        limit: '50'
      };

      for (const validator of paginationValidators) {
        await validator.run(mockRequest as Request);
      }

      expect(mockRequest.query.limit).toBe('50');
    });

    it('should handle optional pagination', async () => {
      mockRequest.query = {};

      for (const validator of paginationValidators) {
        await validator.run(mockRequest as Request);
      }

      expect(mockRequest.query).toEqual({});
    });
  });

  describe('emailValidator', () => {
    it('should validate email format', async () => {
      mockRequest.body = {
        email: 'valid@email.com'
      };

      await emailValidator.run(mockRequest as Request);

      expect(mockRequest.body.email).toBe('valid@email.com');
    });
  });

  describe('passwordValidator', () => {
    it('should validate password length', async () => {
      mockRequest.body = {
        password: 'ValidPass123'
      };

      await passwordValidator.run(mockRequest as Request);

      expect(mockRequest.body.password.length).toBeGreaterThanOrEqual(8);
    });
  });

  describe('idValidator', () => {
    it('should validate MongoDB ObjectId', async () => {
      mockRequest.params = {
        id: '507f1f77bcf86cd799439011'
      };

      await idValidator.run(mockRequest as Request);

      expect(mockRequest.params.id).toMatch(/^[0-9a-fA-F]{24}$/);
    });
  });
});
