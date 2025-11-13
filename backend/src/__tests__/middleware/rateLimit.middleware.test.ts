import request from 'supertest';
import app from '../../app';
import redisClient from '../../config/redis';

describe('Rate Limiting Middleware', () => {
  beforeAll(async () => {
    // Connect to Redis for tests
    if (redisClient && typeof redisClient.connect === 'function') {
      await redisClient.connect();
    }
  });

  afterAll(async () => {
    // Clean up Redis connection
    if (redisClient && typeof redisClient.disconnect === 'function') {
      await redisClient.disconnect();
    }
  });

  beforeEach(async () => {
    // Clear rate limiting data before each test
    if (redisClient && typeof redisClient.flushAll === 'function') {
      await redisClient.flushAll();
    }
  });

  describe('General API Rate Limiting', () => {
    it('should allow requests within limit', async () => {
      // Make 5 requests (well under the 100 limit)
      for (let i = 0; i < 5; i++) {
        const response = await request(app)
          .get('/health')
          .expect(200);
      }
    });

    it('should return rate limit headers', async () => {
      const response = await request(app)
        .get('/health')
        .expect(200);

      expect(response.headers['x-ratelimit-limit']).toBeDefined();
      expect(response.headers['x-ratelimit-remaining']).toBeDefined();
      expect(response.headers['x-ratelimit-reset']).toBeDefined();
      expect(response.headers['x-ratelimit-limit']).toBe('100'); // General limit
    });
  });

  describe('Authentication Rate Limiting', () => {
    it('should allow login attempts within limit', async () => {
      // Make 3 login attempts (under the 5 limit)
      for (let i = 0; i < 3; i++) {
        await request(app)
          .post('/api/auth/login')
          .send({
            email: 'test@example.com',
            password: 'password123'
          })
          .expect(400); // Will fail due to invalid credentials, but should not be rate limited
      }
    });

    it('should block excessive login attempts', async () => {
      // Make 6 login attempts (over the 5 limit)
      for (let i = 0; i < 6; i++) {
        const response = await request(app)
          .post('/api/auth/login')
          .send({
            email: 'test@example.com',
            password: 'password123'
          });

        if (i >= 5) {
          expect(response.status).toBe(429);
          expect(response.body.error).toBe('Too many authentication attempts');
        }
      }
    }, 30000); // Increase timeout for rate limiting test
  });

  describe('Upload Rate Limiting', () => {
    it('should allow uploads within limit', async () => {
      // Make 15 upload requests (under the 20 limit)
      for (let i = 0; i < 15; i++) {
        await request(app)
          .post('/api/upload/image')
          .set('Authorization', 'Bearer invalid-token')
          .expect(401); // Will fail due to auth, but should not be rate limited
      }
    });
  });

  describe('Sensitive Operations Rate Limiting', () => {
    it('should allow payment operations within limit', async () => {
      // Make 5 payment requests (under the 10 limit)
      for (let i = 0; i < 5; i++) {
        await request(app)
          .post('/api/payments/create-payment-intent')
          .set('Authorization', 'Bearer invalid-token')
          .expect(401); // Will fail due to auth, but should not be rate limited
      }
    });
  });
});