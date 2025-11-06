import request from 'supertest';
import app from '../../app';
import { createTestUser, generateTestToken } from '../utils/testHelpers';
import User from '../../models/User.model';

describe('User Controller', () => {
  describe('GET /api/users/profile', () => {
    it('should get own profile', async () => {
      const user = await createTestUser('tourist');
      const token = generateTestToken(user._id.toString(), user.email, user.role);

      const response = await request(app)
        .get('/api/users/profile')
        .set('Authorization', `Bearer ${token}`);

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data.user.email).toBe(user.email);
      expect(response.body.data.user).not.toHaveProperty('password');
    });

    it('should reject without authentication', async () => {
      const response = await request(app)
        .get('/api/users/profile');

      expect(response.status).toBe(401);
    });
  });

  describe('GET /api/users/:id', () => {
    it('should get user public profile by ID', async () => {
      const user = await createTestUser('host');
      const viewer = await createTestUser('tourist');
      const token = generateTestToken(viewer._id.toString(), viewer.email, viewer.role);

      const response = await request(app)
        .get(`/api/users/${user._id}`)
        .set('Authorization', `Bearer ${token}`);

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data.user.firstName).toBe(user.firstName);
      expect(response.body.data.user).not.toHaveProperty('password');
      expect(response.body.data.user).not.toHaveProperty('resetPasswordToken');
    });

    it('should return 404 for non-existent user', async () => {
      const viewer = await createTestUser('tourist');
      const token = generateTestToken(viewer._id.toString(), viewer.email, viewer.role);

      const response = await request(app)
        .get('/api/users/507f1f77bcf86cd799439011')
        .set('Authorization', `Bearer ${token}`);

      expect(response.status).toBe(404);
    });
  });

  describe('PUT /api/users/profile', () => {
    it('should update profile information', async () => {
      const user = await createTestUser('tourist');
      const token = generateTestToken(user._id.toString(), user.email, user.role);

      const response = await request(app)
        .put('/api/users/profile')
        .set('Authorization', `Bearer ${token}`)
        .send({
          firstName: 'UpdatedFirst',
          lastName: 'UpdatedLast',
          bio: 'Updated bio text',
          phoneNumber: '+212600000000'
        });

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data.user.firstName).toBe('UpdatedFirst');
      expect(response.body.data.user.lastName).toBe('UpdatedLast');
      expect(response.body.data.user.bio).toBe('Updated bio text');
    });

    it('should update location information', async () => {
      const user = await createTestUser('host');
      const token = generateTestToken(user._id.toString(), user.email, user.role);

      const response = await request(app)
        .put('/api/users/profile')
        .set('Authorization', `Bearer ${token}`)
        .send({
          city: 'Marrakech',
          country: 'Morocco',
          address: '123 Test Street'
        });

      expect(response.status).toBe(200);
      expect(response.body.data.user.city).toBe('Marrakech');
      expect(response.body.data.user.country).toBe('Morocco');
    });

    it('should update languages', async () => {
      const user = await createTestUser('host');
      const token = generateTestToken(user._id.toString(), user.email, user.role);

      const response = await request(app)
        .put('/api/users/profile')
        .set('Authorization', `Bearer ${token}`)
        .send({
          languages: ['English', 'French', 'Arabic']
        });

      expect(response.status).toBe(200);
      expect(response.body.data.user.languages).toEqual(['English', 'French', 'Arabic']);
    });

    it('should not allow email update', async () => {
      const user = await createTestUser('tourist');
      const token = generateTestToken(user._id.toString(), user.email, user.role);

      const response = await request(app)
        .put('/api/users/profile')
        .set('Authorization', `Bearer ${token}`)
        .send({
          email: 'newemail@test.com'
        });

      // Email should remain unchanged
      const updatedUser = await User.findById(user._id);
      expect(updatedUser?.email).toBe(user.email);
    });

    it('should reject without authentication', async () => {
      const response = await request(app)
        .put('/api/users/profile')
        .send({
          firstName: 'Test'
        });

      expect(response.status).toBe(401);
    });
  });

  describe('POST /api/users/photo', () => {
    it('should upload profile photo', async () => {
      const user = await createTestUser('tourist');
      const token = generateTestToken(user._id.toString(), user.email, user.role);

      const response = await request(app)
        .post('/api/users/photo')
        .set('Authorization', `Bearer ${token}`)
        .attach('photo', Buffer.from('fake-image-data'), 'test.jpg');

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data.user).toHaveProperty('photo');
    });

    it('should reject without authentication', async () => {
      const response = await request(app)
        .post('/api/users/photo')
        .attach('photo', Buffer.from('fake-image-data'), 'test.jpg');

      expect(response.status).toBe(401);
    });

    it('should reject invalid file type', async () => {
      const user = await createTestUser('tourist');
      const token = generateTestToken(user._id.toString(), user.email, user.role);

      const response = await request(app)
        .post('/api/users/photo')
        .set('Authorization', `Bearer ${token}`)
        .attach('photo', Buffer.from('fake-document'), 'test.pdf');

      expect(response.status).toBe(400);
    });
  });

  describe('DELETE /api/users/photo', () => {
    it('should delete profile photo', async () => {
      const user = await createTestUser('tourist');
      user.photo = 'https://example.com/photo.jpg';
      await user.save();
      
      const token = generateTestToken(user._id.toString(), user.email, user.role);

      const response = await request(app)
        .delete('/api/users/photo')
        .set('Authorization', `Bearer ${token}`);

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      
      const updatedUser = await User.findById(user._id);
      expect(updatedUser?.photo).toBeUndefined();
    });

    it('should handle deletion when no photo exists', async () => {
      const user = await createTestUser('tourist');
      const token = generateTestToken(user._id.toString(), user.email, user.role);

      const response = await request(app)
        .delete('/api/users/photo')
        .set('Authorization', `Bearer ${token}`);

      expect(response.status).toBe(200);
    });
  });

  describe('PUT /api/users/settings', () => {
    it('should update notification settings', async () => {
      const user = await createTestUser('tourist');
      const token = generateTestToken(user._id.toString(), user.email, user.role);

      const response = await request(app)
        .put('/api/users/settings')
        .set('Authorization', `Bearer ${token}`)
        .send({
          notificationPreferences: {
            email: true,
            sms: false,
            push: true,
            bookingUpdates: true,
            messageAlerts: false
          }
        });

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data.user.notificationPreferences.email).toBe(true);
      expect(response.body.data.user.notificationPreferences.sms).toBe(false);
    });
  });

  describe('GET /api/users/:id/services', () => {
    it('should get user\'s public services', async () => {
      const host = await createTestUser('host');
      const viewer = await createTestUser('tourist');
      const token = generateTestToken(viewer._id.toString(), viewer.email, viewer.role);

      const response = await request(app)
        .get(`/api/users/${host._id}/services`)
        .set('Authorization', `Bearer ${token}`);

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(Array.isArray(response.body.data.services)).toBe(true);
    });
  });

  describe('GET /api/users/:id/reviews', () => {
    it('should get user\'s reviews', async () => {
      const user = await createTestUser('host');
      const viewer = await createTestUser('tourist');
      const token = generateTestToken(viewer._id.toString(), viewer.email, viewer.role);

      const response = await request(app)
        .get(`/api/users/${user._id}/reviews`)
        .set('Authorization', `Bearer ${token}`);

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(Array.isArray(response.body.data.reviews)).toBe(true);
    });
  });
});
