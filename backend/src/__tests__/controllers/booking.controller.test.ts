import request from 'supertest';
import app from '../../app';
import { createTestUser, createTestService, createTestBooking, generateTestToken } from '../utils/testHelpers';

describe('Booking Controller', () => {
  describe('POST /api/bookings (Protected)', () => {
    it('should create booking for available service', async () => {
      const host = await createTestUser('host');
      const tourist = await createTestUser('tourist');
      const service = await createTestService(host._id.toString());
      const token = generateTestToken(tourist._id.toString(), tourist.email, tourist.role);

      const bookingDate = new Date();
      bookingDate.setDate(bookingDate.getDate() + 7);

      const bookingData = {
        serviceId: service._id.toString(),
        bookingDate: bookingDate.toISOString(),
        numberOfGuests: 2,
        timeSlot: {
          startTime: '09:00',
          endTime: '17:00'
        },
        specialRequests: 'Please provide parking'
      };

      const response = await request(app)
        .post('/api/bookings')
        .set('Authorization', `Bearer ${token}`)
        .send(bookingData)
        .expect(201);

      expect(response.body.success).toBe(true);
      expect(response.body.data.booking.touristId.toString()).toBe(tourist._id.toString());
      expect(response.body.data.booking.hostId.toString()).toBe(host._id.toString());
      expect(response.body.data.booking.serviceId).toBeDefined();
    });

    it('should prevent booking own service', async () => {
      const host = await createTestUser('host');
      const service = await createTestService(host._id.toString());
      const token = generateTestToken(host._id.toString(), host.email, host.role);

      const bookingDate = new Date();
      bookingDate.setDate(bookingDate.getDate() + 7);

      const bookingData = {
        serviceId: service._id.toString(),
        bookingDate: bookingDate.toISOString(),
        numberOfGuests: 2,
        timeSlot: {
          startTime: '09:00',
          endTime: '17:00'
        }
      };

      const response = await request(app)
        .post('/api/bookings')
        .set('Authorization', `Bearer ${token}`)
        .send(bookingData)
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toContain('own service');
    });

    it('should reject booking for inactive service', async () => {
      const host = await createTestUser('host');
      const tourist = await createTestUser('tourist');
      const service = await createTestService(host._id.toString());
      service.status = 'archived';
      await service.save();
      const token = generateTestToken(tourist._id.toString(), tourist.email, tourist.role);

      const bookingDate = new Date();
      bookingDate.setDate(bookingDate.getDate() + 7);

      const bookingData = {
        serviceId: service._id.toString(),
        bookingDate: bookingDate.toISOString(),
        numberOfGuests: 2,
        timeSlot: {
          startTime: '09:00',
          endTime: '17:00'
        }
      };

      const response = await request(app)
        .post('/api/bookings')
        .set('Authorization', `Bearer ${token}`)
        .send(bookingData)
        .expect(400);

      expect(response.body.success).toBe(false);
    });

    it('should reject booking without auth token', async () => {
      const bookingData = {
        serviceId: '507f1f77bcf86cd799439011',
        bookingDate: new Date().toISOString(),
        numberOfGuests: 2,
        timeSlot: {
          startTime: '09:00',
          endTime: '17:00'
        }
      };

      const response = await request(app)
        .post('/api/bookings')
        .send(bookingData)
        .expect(401);

      expect(response.body.success).toBe(false);
    });
  });

  describe('GET /api/bookings/my (Protected)', () => {
    it('should return user\'s bookings', async () => {
      const host = await createTestUser('host');
      const tourist = await createTestUser('tourist');
      const service = await createTestService(host._id.toString());
      await createTestBooking(service._id.toString(), tourist._id.toString(), host._id.toString());
      await createTestBooking(service._id.toString(), tourist._id.toString(), host._id.toString());
      
      const token = generateTestToken(tourist._id.toString(), tourist.email, tourist.role);

      const response = await request(app)
        .get('/api/bookings/my')
        .set('Authorization', `Bearer ${token}`)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.bookings).toHaveLength(2);
      expect(response.body.data.pagination).toBeDefined();
    });

    it('should populate serviceId and hostId correctly', async () => {
      const host = await createTestUser('host');
      const tourist = await createTestUser('tourist');
      const service = await createTestService(host._id.toString());
      await createTestBooking(service._id.toString(), tourist._id.toString(), host._id.toString());
      
      const token = generateTestToken(tourist._id.toString(), tourist.email, tourist.role);

      const response = await request(app)
        .get('/api/bookings/my')
        .set('Authorization', `Bearer ${token}`)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.bookings[0].serviceId).toBeDefined();
      expect(response.body.data.bookings[0].hostId).toBeDefined();
    });

    it('should reject request without auth token', async () => {
      const response = await request(app)
        .get('/api/bookings/my')
        .expect(401);

      expect(response.body.success).toBe(false);
    });
  });

  describe('GET /api/bookings/:id (Protected)', () => {
    it('should return booking details for tourist', async () => {
      const host = await createTestUser('host');
      const tourist = await createTestUser('tourist');
      const service = await createTestService(host._id.toString());
      const booking = await createTestBooking(service._id.toString(), tourist._id.toString(), host._id.toString());
      
      const token = generateTestToken(tourist._id.toString(), tourist.email, tourist.role);

      const response = await request(app)
        .get(`/api/bookings/${booking._id}`)
        .set('Authorization', `Bearer ${token}`)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.booking._id.toString()).toBe(booking._id.toString());
    });

    it('should return booking details for host', async () => {
      const host = await createTestUser('host');
      const tourist = await createTestUser('tourist');
      const service = await createTestService(host._id.toString());
      const booking = await createTestBooking(service._id.toString(), tourist._id.toString(), host._id.toString());
      
      const token = generateTestToken(host._id.toString(), host.email, host.role);

      const response = await request(app)
        .get(`/api/bookings/${booking._id}`)
        .set('Authorization', `Bearer ${token}`)
        .expect(200);

      expect(response.body.success).toBe(true);
    });

    it('should reject access for other users', async () => {
      const host = await createTestUser('host');
      const tourist = await createTestUser('tourist');
      const otherUser = await createTestUser('tourist');
      const service = await createTestService(host._id.toString());
      const booking = await createTestBooking(service._id.toString(), tourist._id.toString(), host._id.toString());
      
      const token = generateTestToken(otherUser._id.toString(), otherUser.email, otherUser.role);

      const response = await request(app)
        .get(`/api/bookings/${booking._id}`)
        .set('Authorization', `Bearer ${token}`)
        .expect(403);

      expect(response.body.success).toBe(false);
    });
  });

  describe('PATCH /api/bookings/:id/status (Host Protected)', () => {
    it('should allow host to confirm booking', async () => {
      const host = await createTestUser('host');
      const tourist = await createTestUser('tourist');
      const service = await createTestService(host._id.toString());
      const booking = await createTestBooking(service._id.toString(), tourist._id.toString(), host._id.toString());
      
      const token = generateTestToken(host._id.toString(), host.email, host.role);

      const response = await request(app)
        .patch(`/api/bookings/${booking._id}/status`)
        .set('Authorization', `Bearer ${token}`)
        .send({ status: 'confirmed' })
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.booking.status).toBe('confirmed');
    });

    it('should allow host to reject booking', async () => {
      const host = await createTestUser('host');
      const tourist = await createTestUser('tourist');
      const service = await createTestService(host._id.toString());
      const booking = await createTestBooking(service._id.toString(), tourist._id.toString(), host._id.toString());
      
      const token = generateTestToken(host._id.toString(), host.email, host.role);

      const response = await request(app)
        .patch(`/api/bookings/${booking._id}/status`)
        .set('Authorization', `Bearer ${token}`)
        .send({ status: 'rejected' })
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.booking.status).toBe('rejected');
    });

    it('should prevent tourist from changing status', async () => {
      const host = await createTestUser('host');
      const tourist = await createTestUser('tourist');
      const service = await createTestService(host._id.toString());
      const booking = await createTestBooking(service._id.toString(), tourist._id.toString(), host._id.toString());
      
      const token = generateTestToken(tourist._id.toString(), tourist.email, tourist.role);

      const response = await request(app)
        .patch(`/api/bookings/${booking._id}/status`)
        .set('Authorization', `Bearer ${token}`)
        .send({ status: 'confirmed' })
        .expect(403);

      expect(response.body.success).toBe(false);
    });
  });

  describe('POST /api/bookings/:id/cancel (Protected)', () => {
    it('should allow tourist to cancel within deadline', async () => {
      const host = await createTestUser('host');
      const tourist = await createTestUser('tourist');
      const service = await createTestService(host._id.toString());
      const booking = await createTestBooking(service._id.toString(), tourist._id.toString(), host._id.toString());
      
      const token = generateTestToken(tourist._id.toString(), tourist.email, tourist.role);

      const response = await request(app)
        .post(`/api/bookings/${booking._id}/cancel`)
        .set('Authorization', `Bearer ${token}`)
        .send({ reason: 'Change of plans' })
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.booking.status).toBe('cancelled');
    });

    it('should prevent cancellation of completed booking', async () => {
      const host = await createTestUser('host');
      const tourist = await createTestUser('tourist');
      const service = await createTestService(host._id.toString());
      const booking = await createTestBooking(service._id.toString(), tourist._id.toString(), host._id.toString());
      booking.status = 'completed';
      await booking.save();
      
      const token = generateTestToken(tourist._id.toString(), tourist.email, tourist.role);

      const response = await request(app)
        .post(`/api/bookings/${booking._id}/cancel`)
        .set('Authorization', `Bearer ${token}`)
        .send({ reason: 'Change of plans' })
        .expect(400);

      expect(response.body.success).toBe(false);
    });
  });
});
