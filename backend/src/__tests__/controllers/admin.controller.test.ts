import request from 'supertest';
import app from '../../app';
import { createTestUser, generateTestToken, createTestService, createTestBooking } from '../utils/testHelpers';
import User from '../../models/User.model';
import Service from '../../models/Service.model';

describe('Admin Controller', () => {
  describe('GET /api/admin/users', () => {
    it('should allow admin to get all users', async () => {
      const admin = await createTestUser('admin');
      await createTestUser('tourist');
      await createTestUser('host');
      
      const token = generateTestToken(admin._id.toString(), admin.email, admin.role);

      const response = await request(app)
        .get('/api/admin/users')
        .set('Authorization', `Bearer ${token}`);

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data.users.length).toBeGreaterThan(0);
      expect(response.body.data.pagination).toHaveProperty('total');
    });

    it('should reject non-admin access', async () => {
      const tourist = await createTestUser('tourist');
      const token = generateTestToken(tourist._id.toString(), tourist.email, tourist.role);

      const response = await request(app)
        .get('/api/admin/users')
        .set('Authorization', `Bearer ${token}`);

      expect(response.status).toBe(403);
    });

    it('should filter users by role', async () => {
      const admin = await createTestUser('admin');
      await createTestUser('tourist');
      await createTestUser('host');
      await createTestUser('host');
      
      const token = generateTestToken(admin._id.toString(), admin.email, admin.role);

      const response = await request(app)
        .get('/api/admin/users?role=host')
        .set('Authorization', `Bearer ${token}`);

      expect(response.status).toBe(200);
      expect(response.body.data.users.every((u: any) => u.role === 'host')).toBe(true);
    });

    it('should search users by name or email', async () => {
      const admin = await createTestUser('admin');
      const user = await createTestUser('tourist');
      
      const token = generateTestToken(admin._id.toString(), admin.email, admin.role);

      const response = await request(app)
        .get(`/api/admin/users?search=${user.email.split('@')[0]}`)
        .set('Authorization', `Bearer ${token}`);

      expect(response.status).toBe(200);
      expect(response.body.data.users.length).toBeGreaterThan(0);
    });

    it('should paginate users list', async () => {
      const admin = await createTestUser('admin');
      
      // Create multiple users
      for (let i = 0; i < 5; i++) {
        await createTestUser('tourist');
      }
      
      const token = generateTestToken(admin._id.toString(), admin.email, admin.role);

      const response = await request(app)
        .get('/api/admin/users?page=1&limit=2')
        .set('Authorization', `Bearer ${token}`);

      expect(response.status).toBe(200);
      expect(response.body.data.users).toHaveLength(2);
      expect(response.body.data.pagination.pages).toBeGreaterThan(1);
    });
  });

  describe('PUT /api/admin/users/:id/suspend', () => {
    it('should suspend user account', async () => {
      const admin = await createTestUser('admin');
      const user = await createTestUser('tourist');
      
      const token = generateTestToken(admin._id.toString(), admin.email, admin.role);

      const response = await request(app)
        .put(`/api/admin/users/${user._id}/suspend`)
        .set('Authorization', `Bearer ${token}`)
        .send({
          reason: 'Violating terms of service'
        });

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      
      const suspendedUser = await User.findById(user._id);
      expect(suspendedUser?.status).toBe('suspended');
    });

    it('should reject non-admin suspension', async () => {
      const host = await createTestUser('host');
      const tourist = await createTestUser('tourist');
      
      const token = generateTestToken(host._id.toString(), host.email, host.role);

      const response = await request(app)
        .put(`/api/admin/users/${tourist._id}/suspend`)
        .set('Authorization', `Bearer ${token}`)
        .send({
          reason: 'Test'
        });

      expect(response.status).toBe(403);
    });

    it('should not allow suspending admin accounts', async () => {
      const admin1 = await createTestUser('admin');
      const admin2 = await createTestUser('admin');
      
      const token = generateTestToken(admin1._id.toString(), admin1.email, admin1.role);

      const response = await request(app)
        .put(`/api/admin/users/${admin2._id}/suspend`)
        .set('Authorization', `Bearer ${token}`)
        .send({
          reason: 'Test'
        });

      expect(response.status).toBe(400);
      expect(response.body.message).toContain('Cannot suspend admin');
    });
  });

  describe('GET /api/admin/services/pending', () => {
    it('should get pending services', async () => {
      const admin = await createTestUser('admin');
      const host = await createTestUser('host');
      
      const service = await createTestService(host._id);
      service.status = 'pending';
      await service.save();
      
      const token = generateTestToken(admin._id.toString(), admin.email, admin.role);

      const response = await request(app)
        .get('/api/admin/services/pending')
        .set('Authorization', `Bearer ${token}`);

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data.services.length).toBeGreaterThan(0);
      expect(response.body.data.services.every((s: any) => s.status === 'pending')).toBe(true);
    });

    it('should reject non-admin access', async () => {
      const host = await createTestUser('host');
      const token = generateTestToken(host._id.toString(), host.email, host.role);

      const response = await request(app)
        .get('/api/admin/services/pending')
        .set('Authorization', `Bearer ${token}`);

      expect(response.status).toBe(403);
    });
  });

  describe('PUT /api/admin/services/:id/approve', () => {
    it('should approve service', async () => {
      const admin = await createTestUser('admin');
      const host = await createTestUser('host');
      const service = await createTestService(host._id);
      
      service.status = 'pending';
      await service.save();
      
      const token = generateTestToken(admin._id.toString(), admin.email, admin.role);

      const response = await request(app)
        .put(`/api/admin/services/${service._id}/approve`)
        .set('Authorization', `Bearer ${token}`);

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      
      const approvedService = await Service.findById(service._id);
      expect(approvedService?.status).toBe('active');
    });

    it('should reject service', async () => {
      const admin = await createTestUser('admin');
      const host = await createTestUser('host');
      const service = await createTestService(host._id);
      
      service.status = 'pending';
      await service.save();
      
      const token = generateTestToken(admin._id.toString(), admin.email, admin.role);

      const response = await request(app)
        .put(`/api/admin/services/${service._id}/reject`)
        .set('Authorization', `Bearer ${token}`)
        .send({
          reason: 'Does not meet quality standards'
        });

      expect(response.status).toBe(200);
      
      const rejectedService = await Service.findById(service._id);
      expect(rejectedService?.status).toBe('rejected');
    });
  });

  describe('GET /api/admin/stats', () => {
    it('should get platform statistics', async () => {
      const admin = await createTestUser('admin');
      const token = generateTestToken(admin._id.toString(), admin.email, admin.role);

      const response = await request(app)
        .get('/api/admin/stats')
        .set('Authorization', `Bearer ${token}`);

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data.statistics).toHaveProperty('totalUsers');
      expect(response.body.data.statistics).toHaveProperty('totalServices');
      expect(response.body.data.statistics).toHaveProperty('totalBookings');
      expect(response.body.data.statistics).toHaveProperty('totalRevenue');
    });

    it('should include user breakdown by role', async () => {
      const admin = await createTestUser('admin');
      await createTestUser('tourist');
      await createTestUser('host');
      await createTestUser('host');
      
      const token = generateTestToken(admin._id.toString(), admin.email, admin.role);

      const response = await request(app)
        .get('/api/admin/stats')
        .set('Authorization', `Bearer ${token}`);

      expect(response.status).toBe(200);
      expect(response.body.data.statistics).toHaveProperty('usersByRole');
    });

    it('should reject non-admin access', async () => {
      const tourist = await createTestUser('tourist');
      const token = generateTestToken(tourist._id.toString(), tourist.email, tourist.role);

      const response = await request(app)
        .get('/api/admin/stats')
        .set('Authorization', `Bearer ${token}`);

      expect(response.status).toBe(403);
    });
  });

  describe('GET /api/admin/bookings', () => {
    it('should get all bookings', async () => {
      const admin = await createTestUser('admin');
      const tourist = await createTestUser('tourist');
      const host = await createTestUser('host');
      const service = await createTestService(host._id);
      
      await createTestBooking(service._id, tourist._id, host._id);
      await createTestBooking(service._id, tourist._id, host._id);
      
      const token = generateTestToken(admin._id.toString(), admin.email, admin.role);

      const response = await request(app)
        .get('/api/admin/bookings')
        .set('Authorization', `Bearer ${token}`);

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data.bookings.length).toBeGreaterThan(0);
    });

    it('should filter bookings by status', async () => {
      const admin = await createTestUser('admin');
      const tourist = await createTestUser('tourist');
      const host = await createTestUser('host');
      const service = await createTestService(host._id);
      
      const booking = await createTestBooking(service._id, tourist._id, host._id);
      booking.status = 'confirmed';
      await booking.save();
      
      const token = generateTestToken(admin._id.toString(), admin.email, admin.role);

      const response = await request(app)
        .get('/api/admin/bookings?status=confirmed')
        .set('Authorization', `Bearer ${token}`);

      expect(response.status).toBe(200);
      expect(response.body.data.bookings.every((b: any) => b.status === 'confirmed')).toBe(true);
    });
  });

  describe('DELETE /api/admin/users/:id', () => {
    it('should delete user account', async () => {
      const admin = await createTestUser('admin');
      const user = await createTestUser('tourist');
      
      const token = generateTestToken(admin._id.toString(), admin.email, admin.role);

      const response = await request(app)
        .delete(`/api/admin/users/${user._id}`)
        .set('Authorization', `Bearer ${token}`);

      expect(response.status).toBe(200);
      
      const deletedUser = await User.findById(user._id);
      expect(deletedUser).toBeNull();
    });

    it('should reject non-admin deletion', async () => {
      const host = await createTestUser('host');
      const tourist = await createTestUser('tourist');
      
      const token = generateTestToken(host._id.toString(), host.email, host.role);

      const response = await request(app)
        .delete(`/api/admin/users/${tourist._id}`)
        .set('Authorization', `Bearer ${token}`);

      expect(response.status).toBe(403);
    });
  });
});
