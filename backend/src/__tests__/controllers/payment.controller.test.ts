import request from 'supertest';
import app from '../../app';
import { createTestUser, generateTestToken, createTestService, createTestBooking } from '../utils/testHelpers';
import Payment from '../../models/Payment.model';
import Booking from '../../models/Booking.model';

describe('Payment Controller', () => {
  describe('POST /api/payments/create-intent', () => {
    it('should create payment intent for valid booking', async () => {
      const tourist = await createTestUser('tourist');
      const host = await createTestUser('host');
      const service = await createTestService(host._id);
      const booking = await createTestBooking(service._id, tourist._id, host._id);
      
      const token = generateTestToken(tourist._id.toString(), tourist.email, tourist.role);

      const response = await request(app)
        .post('/api/payments/create-intent')
        .set('Authorization', `Bearer ${token}`)
        .send({
          bookingId: booking._id
        });

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data).toHaveProperty('clientSecret');
      expect(response.body.data).toHaveProperty('payment');
    });

    it('should reject payment for non-existent booking', async () => {
      const tourist = await createTestUser('tourist');
      const token = generateTestToken(tourist._id.toString(), tourist.email, tourist.role);

      const response = await request(app)
        .post('/api/payments/create-intent')
        .set('Authorization', `Bearer ${token}`)
        .send({
          bookingId: '507f1f77bcf86cd799439011'
        });

      expect(response.status).toBe(404);
      expect(response.body.success).toBe(false);
    });

    it('should reject payment for other user\'s booking', async () => {
      const tourist1 = await createTestUser('tourist');
      const tourist2 = await createTestUser('tourist');
      const host = await createTestUser('host');
      const service = await createTestService(host._id);
      const booking = await createTestBooking(service._id, tourist1._id, host._id);
      
      const token = generateTestToken(tourist2._id.toString(), tourist2.email, tourist2.role);

      const response = await request(app)
        .post('/api/payments/create-intent')
        .set('Authorization', `Bearer ${token}`)
        .send({
          bookingId: booking._id
        });

      expect(response.status).toBe(403);
      expect(response.body.message).toContain('Not authorized');
    });

    it('should reject double payment for same booking', async () => {
      const tourist = await createTestUser('tourist');
      const host = await createTestUser('host');
      const service = await createTestService(host._id);
      const booking = await createTestBooking(service._id, tourist._id, host._id);
      
      // Create existing payment
      await Payment.create({
        booking: booking._id,
        user: tourist._id,
        amount: booking.totalAmount,
        paymentMethod: 'stripe',
        transactionId: 'pi_test123',
        status: 'completed'
      });
      
      const token = generateTestToken(tourist._id.toString(), tourist.email, tourist.role);

      const response = await request(app)
        .post('/api/payments/create-intent')
        .set('Authorization', `Bearer ${token}`)
        .send({
          bookingId: booking._id
        });

      expect(response.status).toBe(400);
      expect(response.body.message).toContain('already paid');
    });

    it('should reject without authentication', async () => {
      const response = await request(app)
        .post('/api/payments/create-intent')
        .send({
          bookingId: '507f1f77bcf86cd799439011'
        });

      expect(response.status).toBe(401);
    });
  });

  describe('GET /api/payments/:bookingId', () => {
    it('should get payment details for tourist', async () => {
      const tourist = await createTestUser('tourist');
      const host = await createTestUser('host');
      const service = await createTestService(host._id);
      const booking = await createTestBooking(service._id, tourist._id, host._id);
      
      const payment = await Payment.create({
        booking: booking._id,
        user: tourist._id,
        amount: booking.totalAmount,
        paymentMethod: 'stripe',
        transactionId: 'pi_test456',
        status: 'completed'
      });
      
      const token = generateTestToken(tourist._id.toString(), tourist.email, tourist.role);

      const response = await request(app)
        .get(`/api/payments/${booking._id}`)
        .set('Authorization', `Bearer ${token}`);

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data.payment.transactionId).toBe('pi_test456');
      expect(response.body.data.payment.status).toBe('completed');
    });

    it('should get payment details for host', async () => {
      const tourist = await createTestUser('tourist');
      const host = await createTestUser('host');
      const service = await createTestService(host._id);
      const booking = await createTestBooking(service._id, tourist._id, host._id);
      
      await Payment.create({
        booking: booking._id,
        user: tourist._id,
        amount: booking.totalAmount,
        paymentMethod: 'stripe',
        transactionId: 'pi_test789',
        status: 'completed'
      });
      
      const token = generateTestToken(host._id.toString(), host.email, host.role);

      const response = await request(app)
        .get(`/api/payments/${booking._id}`)
        .set('Authorization', `Bearer ${token}`);

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
    });

    it('should reject payment access by other users', async () => {
      const tourist = await createTestUser('tourist');
      const host = await createTestUser('host');
      const otherUser = await createTestUser('tourist');
      const service = await createTestService(host._id);
      const booking = await createTestBooking(service._id, tourist._id, host._id);
      
      await Payment.create({
        booking: booking._id,
        user: tourist._id,
        amount: booking.totalAmount,
        paymentMethod: 'stripe',
        status: 'completed'
      });
      
      const token = generateTestToken(otherUser._id.toString(), otherUser.email, otherUser.role);

      const response = await request(app)
        .get(`/api/payments/${booking._id}`)
        .set('Authorization', `Bearer ${token}`);

      expect(response.status).toBe(403);
    });
  });

  describe('GET /api/payments/my', () => {
    it('should get user\'s payment history', async () => {
      const tourist = await createTestUser('tourist');
      const host = await createTestUser('host');
      const service = await createTestService(host._id);
      const booking1 = await createTestBooking(service._id, tourist._id, host._id);
      const booking2 = await createTestBooking(service._id, tourist._id, host._id);
      
      await Payment.create([
        {
          booking: booking1._id,
          user: tourist._id,
          amount: 100,
          paymentMethod: 'stripe',
          status: 'completed'
        },
        {
          booking: booking2._id,
          user: tourist._id,
          amount: 200,
          paymentMethod: 'stripe',
          status: 'pending'
        }
      ]);
      
      const token = generateTestToken(tourist._id.toString(), tourist.email, tourist.role);

      const response = await request(app)
        .get('/api/payments/my')
        .set('Authorization', `Bearer ${token}`);

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data.payments).toHaveLength(2);
    });

    it('should filter payments by status', async () => {
      const tourist = await createTestUser('tourist');
      const host = await createTestUser('host');
      const service = await createTestService(host._id);
      const booking = await createTestBooking(service._id, tourist._id, host._id);
      
      await Payment.create({
        booking: booking._id,
        user: tourist._id,
        amount: 100,
        paymentMethod: 'stripe',
        status: 'completed'
      });
      
      const token = generateTestToken(tourist._id.toString(), tourist.email, tourist.role);

      const response = await request(app)
        .get('/api/payments/my?status=completed')
        .set('Authorization', `Bearer ${token}`);

      expect(response.status).toBe(200);
      expect(response.body.data.payments).toHaveLength(1);
      expect(response.body.data.payments[0].status).toBe('completed');
    });

    it('should paginate payment history', async () => {
      const tourist = await createTestUser('tourist');
      const host = await createTestUser('host');
      const service = await createTestService(host._id);
      
      // Create multiple payments
      for (let i = 0; i < 5; i++) {
        const booking = await createTestBooking(service._id, tourist._id, host._id);
        await Payment.create({
          booking: booking._id,
          user: tourist._id,
          amount: 100,
          paymentMethod: 'stripe',
          status: 'completed'
        });
      }
      
      const token = generateTestToken(tourist._id.toString(), tourist.email, tourist.role);

      const response = await request(app)
        .get('/api/payments/my?page=1&limit=2')
        .set('Authorization', `Bearer ${token}`);

      expect(response.status).toBe(200);
      expect(response.body.data.payments).toHaveLength(2);
      expect(response.body.data.pagination).toHaveProperty('total');
      expect(response.body.data.pagination.total).toBe(5);
    });
  });

  describe('POST /api/payments/refund', () => {
    it('should process refund for cancelled booking', async () => {
      const tourist = await createTestUser('tourist');
      const host = await createTestUser('host');
      const service = await createTestService(host._id);
      const booking = await createTestBooking(service._id, tourist._id, host._id);
      
      booking.status = 'cancelled';
      await booking.save();
      
      const payment = await Payment.create({
        booking: booking._id,
        user: tourist._id,
        amount: 100,
        paymentMethod: 'stripe',
        transactionId: 'pi_refund123',
        status: 'completed'
      });
      
      const token = generateTestToken(tourist._id.toString(), tourist.email, tourist.role);

      const response = await request(app)
        .post('/api/payments/refund')
        .set('Authorization', `Bearer ${token}`)
        .send({
          paymentId: payment._id
        });

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data.payment.status).toBe('refunded');
    });

    it('should reject refund for active booking', async () => {
      const tourist = await createTestUser('tourist');
      const host = await createTestUser('host');
      const service = await createTestService(host._id);
      const booking = await createTestBooking(service._id, tourist._id, host._id);
      
      const payment = await Payment.create({
        booking: booking._id,
        user: tourist._id,
        amount: 100,
        paymentMethod: 'stripe',
        status: 'completed'
      });
      
      const token = generateTestToken(tourist._id.toString(), tourist.email, tourist.role);

      const response = await request(app)
        .post('/api/payments/refund')
        .set('Authorization', `Bearer ${token}`)
        .send({
          paymentId: payment._id
        });

      expect(response.status).toBe(400);
      expect(response.body.message).toContain('cannot be refunded');
    });
  });
});
