import request from 'supertest';
import app from '../../app';
import User from '../../models/User.model';
import { createTestUser, generateTestToken } from '../utils/testHelpers';
import { generateRefreshToken } from '../../utils/jwt.util';

describe('Auth Controller', () => {
  describe('POST /api/auth/register', () => {
    it('should register a new user with valid data', async () => {
      const userData = {
        email: 'newuser@test.com',
        password: 'password123',
        firstName: 'John',
        lastName: 'Doe',
        phoneNumber: '+212600000000',
        role: 'tourist'
      };

      const response = await request(app)
        .post('/api/auth/register')
        .send(userData)
        .expect(201);

      expect(response.body.success).toBe(true);
      expect(response.body.data).toHaveProperty('user');
      expect(response.body.data).toHaveProperty('accessToken');
      expect(response.body.data).toHaveProperty('refreshToken');
      expect(response.body.data.user.email).toBe(userData.email);
      expect(response.body.data.user).not.toHaveProperty('password');
    });

    it('should reject registration with duplicate email', async () => {
      const user = await createTestUser();
      
      const userData = {
        email: user.email,
        password: 'password123',
        firstName: 'Jane',
        lastName: 'Doe',
        phoneNumber: '+212600000001',
        role: 'tourist'
      };

      const response = await request(app)
        .post('/api/auth/register')
        .send(userData)
        .expect(400);

      expect(response.body.success).toBe(false);
    });

    it('should reject registration with weak password', async () => {
      const userData = {
        email: 'test@test.com',
        password: '123', // Too short
        firstName: 'John',
        lastName: 'Doe',
        phoneNumber: '+212600000000',
        role: 'tourist'
      };

      const response = await request(app)
        .post('/api/auth/register')
        .send(userData)
        .expect(400);

      expect(response.body.success).toBe(false);
    });

    it('should reject registration with missing required fields', async () => {
      const userData = {
        email: 'test@test.com',
        // Missing password
        firstName: 'John',
        lastName: 'Doe'
      };

      const response = await request(app)
        .post('/api/auth/register')
        .send(userData)
        .expect(400);

      expect(response.body.success).toBe(false);
    });
  });

  describe('POST /api/auth/login', () => {
    it('should login with correct credentials', async () => {
      const user = await createTestUser();
      
      const response = await request(app)
        .post('/api/auth/login')
        .send({
          email: user.email,
          password: 'password123'
        })
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data).toHaveProperty('accessToken');
      expect(response.body.data).toHaveProperty('refreshToken');
      expect(response.body.data.user.email).toBe(user.email);
    });

    it('should reject login with wrong password', async () => {
      const user = await createTestUser();
      
      const response = await request(app)
        .post('/api/auth/login')
        .send({
          email: user.email,
          password: 'wrongpassword'
        })
        .expect(401);

      expect(response.body.success).toBe(false);
    });

    it('should reject login with non-existent email', async () => {
      const response = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'nonexistent@test.com',
          password: 'password123'
        })
        .expect(401);

      expect(response.body.success).toBe(false);
    });

    it('should reject login for inactive account', async () => {
      const user = await createTestUser();
      user.isActive = false;
      await user.save();
      
      const response = await request(app)
        .post('/api/auth/login')
        .send({
          email: user.email,
          password: 'password123'
        })
        .expect(401);

      expect(response.body.success).toBe(false);
    });
  });

  describe('POST /api/auth/refresh', () => {
    it('should refresh token with valid refreshToken', async () => {
      const user = await createTestUser();
      const refreshToken = generateRefreshToken({
        userId: user._id.toString(),
        email: user.email,
        role: user.role
      });
      
      const response = await request(app)
        .post('/api/auth/refresh')
        .send({ refreshToken })
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data).toHaveProperty('accessToken');
    });

    it('should reject refresh with invalid token', async () => {
      const response = await request(app)
        .post('/api/auth/refresh')
        .send({ refreshToken: 'invalid-token' })
        .expect(401);

      expect(response.body.success).toBe(false);
    });

    it('should reject refresh without token', async () => {
      const response = await request(app)
        .post('/api/auth/refresh')
        .send({})
        .expect(400);

      expect(response.body.success).toBe(false);
    });
  });

  describe('GET /api/auth/verify-email/:token', () => {
    it('should verify email with valid token', async () => {
      const user = await User.create({
        email: 'verify@test.com',
        password: 'password123',
        role: 'tourist',
        profile: {
          firstName: 'Test',
          lastName: 'User',
          phone: '+212600000000',
          languages: ['French']
        },
        emailVerified: false,
        verificationToken: 'valid-token-123',
        isActive: true,
        notificationPreferences: {
          email: true,
          push: true,
          sms: false
        }
      });

      const response = await request(app)
        .get('/api/auth/verify-email/valid-token-123')
        .expect(200);

      expect(response.body.success).toBe(true);
      
      const updatedUser = await User.findById(user._id);
      expect(updatedUser?.emailVerified).toBe(true);
    });

    it('should reject invalid verification token', async () => {
      const response = await request(app)
        .get('/api/auth/verify-email/invalid-token')
        .expect(400);

      expect(response.body.success).toBe(false);
    });
  });
});
