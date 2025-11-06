import request from 'supertest';
import app from '../../app';
import { createTestUser, createTestService, generateTestToken } from '../utils/testHelpers';

describe('Service Controller', () => {
  describe('GET /api/services', () => {
    it('should return all active services', async () => {
      const host = await createTestUser('host');
      await createTestService(host._id.toString());
      await createTestService(host._id.toString());

      const response = await request(app)
        .get('/api/services')
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.services).toHaveLength(2);
      expect(response.body.data.pagination).toBeDefined();
    });

    it('should filter services by category', async () => {
      const host = await createTestUser('host');
      const service1 = await createTestService(host._id.toString());
      
      const service2 = await createTestService(host._id.toString());
      service2.category = 'Skills';
      await service2.save();

      const response = await request(app)
        .get('/api/services?category=Space')
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.services).toHaveLength(1);
      expect(response.body.data.services[0].category).toBe('Space');
    });

    it('should filter services by city', async () => {
      const host = await createTestUser('host');
      const service1 = await createTestService(host._id.toString());
      
      const service2 = await createTestService(host._id.toString());
      service2.location.city = 'Marrakech';
      await service2.save();

      const response = await request(app)
        .get('/api/services?city=Casablanca')
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.services).toHaveLength(1);
      expect(response.body.data.services[0].location.city).toBe('Casablanca');
    });

    it('should filter services by price range', async () => {
      const host = await createTestUser('host');
      const service1 = await createTestService(host._id.toString());
      service1.pricing.amount = 50;
      await service1.save();
      
      const service2 = await createTestService(host._id.toString());
      service2.pricing.amount = 150;
      await service2.save();

      const response = await request(app)
        .get('/api/services?minPrice=100&maxPrice=200')
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.services).toHaveLength(1);
      expect(response.body.data.services[0].pricing.amount).toBe(150);
    });

    it('should paginate results correctly', async () => {
      const host = await createTestUser('host');
      for (let i = 0; i < 15; i++) {
        await createTestService(host._id.toString());
      }

      const response = await request(app)
        .get('/api/services?page=1&limit=10')
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.services).toHaveLength(10);
      expect(response.body.data.pagination.total).toBe(15);
      expect(response.body.data.pagination.pages).toBe(2);
    });

    it('should populate hostId field correctly', async () => {
      const host = await createTestUser('host');
      await createTestService(host._id.toString());

      const response = await request(app)
        .get('/api/services')
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.services[0].hostId).toBeDefined();
      expect(response.body.data.services[0].hostId.profile).toBeDefined();
    });
  });

  describe('GET /api/services/:id', () => {
    it('should return service details', async () => {
      const host = await createTestUser('host');
      const service = await createTestService(host._id.toString());

      const response = await request(app)
        .get(`/api/services/${service._id}`)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.service.title).toBe(service.title);
    });

    it('should return 404 for invalid service ID', async () => {
      const response = await request(app)
        .get('/api/services/507f1f77bcf86cd799439011')
        .expect(404);

      expect(response.body.success).toBe(false);
    });
  });

  describe('POST /api/services (Protected)', () => {
    it('should create service for authenticated host', async () => {
      const host = await createTestUser('host');
      const token = generateTestToken(host._id.toString(), host.email, host.role);

      const serviceData = {
        category: 'Skills',
        title: 'Photography Lessons',
        description: 'Professional photography lessons for beginners and intermediates.',
        pricing: {
          amount: 200,
          currency: 'MAD',
          priceType: 'per_hour'
        },
        location: {
          address: '456 Photo St',
          city: 'Marrakech',
          region: 'Marrakech-Safi'
        },
        capacity: 5,
        languages: ['French', 'English'],
        amenities: ['Equipment', 'Studio']
      };

      const response = await request(app)
        .post('/api/services')
        .set('Authorization', `Bearer ${token}`)
        .send(serviceData)
        .expect(201);

      expect(response.body.success).toBe(true);
      expect(response.body.data.service.title).toBe(serviceData.title);
      expect(response.body.data.service.hostId.toString()).toBe(host._id.toString());
    });

    it('should reject creation without auth token', async () => {
      const serviceData = {
        category: 'Skills',
        title: 'Test Service',
        description: 'Test description that is long enough for validation.',
      };

      const response = await request(app)
        .post('/api/services')
        .send(serviceData)
        .expect(401);

      expect(response.body.success).toBe(false);
    });

    it('should reject creation with invalid data', async () => {
      const host = await createTestUser('host');
      const token = generateTestToken(host._id.toString(), host.email, host.role);

      const serviceData = {
        category: 'InvalidCategory',
        title: 'Test',
        // Missing required fields
      };

      const response = await request(app)
        .post('/api/services')
        .set('Authorization', `Bearer ${token}`)
        .send(serviceData)
        .expect(400);

      expect(response.body.success).toBe(false);
    });
  });

  describe('PUT /api/services/:id (Protected)', () => {
    it('should update own service', async () => {
      const host = await createTestUser('host');
      const service = await createTestService(host._id.toString());
      const token = generateTestToken(host._id.toString(), host.email, host.role);

      const updateData = {
        title: 'Updated Service Title',
        description: 'Updated description that meets the minimum length requirement.'
      };

      const response = await request(app)
        .put(`/api/services/${service._id}`)
        .set('Authorization', `Bearer ${token}`)
        .send(updateData)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.service.title).toBe(updateData.title);
    });

    it('should reject update of another host\'s service', async () => {
      const host1 = await createTestUser('host');
      const host2 = await createTestUser('host');
      const service = await createTestService(host1._id.toString());
      const token = generateTestToken(host2._id.toString(), host2.email, host2.role);

      const updateData = {
        title: 'Trying to Update'
      };

      const response = await request(app)
        .put(`/api/services/${service._id}`)
        .set('Authorization', `Bearer ${token}`)
        .send(updateData)
        .expect(403);

      expect(response.body.success).toBe(false);
    });
  });

  describe('DELETE /api/services/:id (Protected)', () => {
    it('should delete own service', async () => {
      const host = await createTestUser('host');
      const service = await createTestService(host._id.toString());
      const token = generateTestToken(host._id.toString(), host.email, host.role);

      const response = await request(app)
        .delete(`/api/services/${service._id}`)
        .set('Authorization', `Bearer ${token}`)
        .expect(200);

      expect(response.body.success).toBe(true);
    });

    it('should allow admin to delete any service', async () => {
      const host = await createTestUser('host');
      const admin = await createTestUser('admin');
      const service = await createTestService(host._id.toString());
      const token = generateTestToken(admin._id.toString(), admin.email, admin.role);

      const response = await request(app)
        .delete(`/api/services/${service._id}`)
        .set('Authorization', `Bearer ${token}`)
        .expect(200);

      expect(response.body.success).toBe(true);
    });

    it('should reject deletion of another host\'s service', async () => {
      const host1 = await createTestUser('host');
      const host2 = await createTestUser('host');
      const service = await createTestService(host1._id.toString());
      const token = generateTestToken(host2._id.toString(), host2.email, host2.role);

      const response = await request(app)
        .delete(`/api/services/${service._id}`)
        .set('Authorization', `Bearer ${token}`)
        .expect(403);

      expect(response.body.success).toBe(false);
    });
  });
});
