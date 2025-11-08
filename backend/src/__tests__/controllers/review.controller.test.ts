import request from 'supertest';
import app from '../../app';
import { createTestUser, generateTestToken, createTestService, createTestBooking, createTestReview } from '../utils/testHelpers';
import Review from '../../models/Review.model';
import Booking from '../../models/Booking.model';

describe('Review Controller', () => {
  describe('POST /api/reviews', () => {
    it('should create review after completed booking', async () => {
      const tourist = await createTestUser('tourist');
      const host = await createTestUser('host');
      const service = await createTestService(host._id);
      const booking = await createTestBooking(service._id, tourist._id, host._id);
      
      // Mark booking as completed
      booking.status = 'completed';
      await booking.save();
      
      const token = generateTestToken(tourist._id.toString(), tourist.email, tourist.role);

      const response = await request(app)
        .post('/api/reviews')
        .set('Authorization', `Bearer ${token}`)
        .send({
          bookingId: booking._id.toString(),
          serviceId: service._id.toString(),
          rating: 5,
          comment: 'Excellent service!'
        });

      expect(response.status).toBe(201);
      expect(response.body.success).toBe(true);
  expect(response.body.data.ratings.overall).toBe(5);
      expect(response.body.data.comment).toBe('Excellent service!');
    });

    it('should reject review for non-completed booking', async () => {
      const tourist = await createTestUser('tourist');
      const host = await createTestUser('host');
      const service = await createTestService(host._id);
      const booking = await createTestBooking(service._id, tourist._id, host._id);
      
      const token = generateTestToken(tourist._id.toString(), tourist.email, tourist.role);

      const response = await request(app)
        .post('/api/reviews')
        .set('Authorization', `Bearer ${token}`)
        .send({
          bookingId: booking._id,
          serviceId: service._id,
          rating: 5,
          comment: 'Great!'
        });

      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
    });

    it('should reject duplicate review', async () => {
      const tourist = await createTestUser('tourist');
      const host = await createTestUser('host');
      const service = await createTestService(host._id);
      const booking = await createTestBooking(service._id, tourist._id, host._id);
      
      booking.status = 'completed';
      await booking.save();
      
      // Create first review
      await createTestReview(
        booking._id.toString(),
        service._id.toString(),
        tourist._id.toString(),
        host._id.toString(),
        'tourist',
        5
      );
      
      const token = generateTestToken(tourist._id.toString(), tourist.email, tourist.role);

      const response = await request(app)
        .post('/api/reviews')
        .set('Authorization', `Bearer ${token}`)
        .send({
          bookingId: booking._id.toString(),
          serviceId: service._id.toString(),
          rating: 4,
          comment: 'Second review'
        });

  expect(response.status).toBe(409);
  expect(response.body.message).toContain('already submitted');
    });

    it('should reject invalid rating', async () => {
      const tourist = await createTestUser('tourist');
      const host = await createTestUser('host');
      const service = await createTestService(host._id);
      const booking = await createTestBooking(service._id, tourist._id, host._id);
      
      booking.status = 'completed';
      await booking.save();
      
      const token = generateTestToken(tourist._id.toString(), tourist.email, tourist.role);

      const response = await request(app)
        .post('/api/reviews')
        .set('Authorization', `Bearer ${token}`)
        .send({
          bookingId: booking._id,
          serviceId: service._id,
          rating: 6, // Invalid: should be 1-5
          comment: 'Review'
        });

      expect(response.status).toBe(400);
    });
  });

  describe('GET /api/reviews/service/:serviceId', () => {
    it('should return all reviews for a service', async () => {
      const host = await createTestUser('host');
      const service = await createTestService(host._id);
      
      const tourist1 = await createTestUser('tourist');
      const tourist2 = await createTestUser('tourist');
      
      const booking1 = await createTestBooking(service._id, tourist1._id, host._id);
      const booking2 = await createTestBooking(service._id, tourist2._id, host._id);
      
      booking1.status = 'completed';
      booking2.status = 'completed';
      await booking1.save();
      await booking2.save();
      
      await createTestReview(
        booking1._id.toString(),
        service._id.toString(),
        tourist1._id.toString(),
        host._id.toString(),
        'tourist',
        5
      );
      await createTestReview(
        booking2._id.toString(),
        service._id.toString(),
        tourist2._id.toString(),
        host._id.toString(),
        'tourist',
        4
      );

      const response = await request(app)
        .get(`/api/reviews/service/${service._id}`);

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data.reviews).toHaveLength(2);
      expect(response.body.data.averageRating).toBe(4.5);
    });

    it('should populate reviewerId field', async () => {
      const host = await createTestUser('host');
      const service = await createTestService(host._id);
      const tourist = await createTestUser('tourist');
      const booking = await createTestBooking(service._id, tourist._id, host._id);
      
      booking.status = 'completed';
      await booking.save();
      
      await createTestReview(
        booking._id.toString(),
        service._id.toString(),
        tourist._id.toString(),
        host._id.toString(),
        'tourist',
        5
      );

      const response = await request(app)
        .get(`/api/reviews/service/${service._id}`);

      expect(response.status).toBe(200);
  expect(response.body.data.reviews[0].reviewerId).toHaveProperty('profile');
  expect(response.body.data.reviews[0].reviewerId.profile).toHaveProperty('firstName');
    });
  });

  describe('POST /api/reviews/:id/respond', () => {
    it('should allow host to respond to review', async () => {
      const host = await createTestUser('host');
      const service = await createTestService(host._id);
      const tourist = await createTestUser('tourist');
      const booking = await createTestBooking(service._id, tourist._id, host._id);
      
      booking.status = 'completed';
      await booking.save();
      
      const review = await createTestReview(
        booking._id.toString(),
        service._id.toString(),
        tourist._id.toString(),
        host._id.toString(),
        'tourist',
        5
      );
      
      const token = generateTestToken(host._id.toString(), host.email, host.role);

      const response = await request(app)
        .post(`/api/reviews/${review._id}/respond`)
        .set('Authorization', `Bearer ${token}`)
        .send({
          response: 'Thank you for your feedback!'
        });

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
  expect(response.body.data.response.text).toBe('Thank you for your feedback!');
    });

    it('should reject response from non-host', async () => {
      const host = await createTestUser('host');
      const service = await createTestService(host._id);
      const tourist = await createTestUser('tourist');
      const booking = await createTestBooking(service._id, tourist._id, host._id);
      
      booking.status = 'completed';
      await booking.save();
      
      const review = await createTestReview(
        booking._id.toString(),
        service._id.toString(),
        tourist._id.toString(),
        host._id.toString(),
        'tourist',
        5
      );
      
      const otherUser = await createTestUser('tourist');
      const token = generateTestToken(otherUser._id.toString(), otherUser.email, otherUser.role);

      const response = await request(app)
        .post(`/api/reviews/${review._id}/respond`)
        .set('Authorization', `Bearer ${token}`)
        .send({
          response: 'Not my service'
        });

      expect(response.status).toBe(403);
    });
  });

  describe('DELETE /api/reviews/:id', () => {
    it('should allow reviewer to delete own review', async () => {
      const host = await createTestUser('host');
      const service = await createTestService(host._id);
      const tourist = await createTestUser('tourist');
      const booking = await createTestBooking(service._id, tourist._id, host._id);
      
      booking.status = 'completed';
      await booking.save();
      
      const review = await createTestReview(
        booking._id.toString(),
        service._id.toString(),
        tourist._id.toString(),
        host._id.toString(),
        'tourist',
        5
      );
      
      const token = generateTestToken(tourist._id.toString(), tourist.email, tourist.role);

      const response = await request(app)
        .delete(`/api/reviews/${review._id}`)
        .set('Authorization', `Bearer ${token}`);

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);

      const deletedReview = await Review.findById(review._id);
      expect(deletedReview).toBeNull();
    });

    it('should allow admin to delete any review', async () => {
      const host = await createTestUser('host');
      const service = await createTestService(host._id);
      const tourist = await createTestUser('tourist');
      const booking = await createTestBooking(service._id, tourist._id, host._id);
      
      booking.status = 'completed';
      await booking.save();
      
      const review = await createTestReview(
        booking._id.toString(),
        service._id.toString(),
        tourist._id.toString(),
        host._id.toString(),
        'tourist',
        1
      );
      
      const admin = await createTestUser('admin');
      const token = generateTestToken(admin._id.toString(), admin.email, admin.role);

      const response = await request(app)
        .delete(`/api/reviews/${review._id}`)
        .set('Authorization', `Bearer ${token}`);

      expect(response.status).toBe(200);
    });

    it('should reject deletion by other users', async () => {
      const host = await createTestUser('host');
      const service = await createTestService(host._id);
      const tourist = await createTestUser('tourist');
      const booking = await createTestBooking(service._id, tourist._id, host._id);
      
      booking.status = 'completed';
      await booking.save();
      
      const review = await createTestReview(
        booking._id.toString(),
        service._id.toString(),
        tourist._id.toString(),
        host._id.toString(),
        'tourist',
        5
      );
      
      const otherUser = await createTestUser('tourist');
      const token = generateTestToken(otherUser._id.toString(), otherUser.email, otherUser.role);

      const response = await request(app)
        .delete(`/api/reviews/${review._id}`)
        .set('Authorization', `Bearer ${token}`);

      expect(response.status).toBe(403);
    });
  });
});
