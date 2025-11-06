import request from 'supertest';
import app from '../../app';
import { createTestUser, generateTestToken } from '../utils/testHelpers';
import Message from '../../models/Message.model';

describe('Message Controller', () => {
  describe('POST /api/messages', () => {
    it('should send text message', async () => {
      const sender = await createTestUser('tourist');
      const receiver = await createTestUser('host');
      const token = generateTestToken(sender._id.toString(), sender.email, sender.role);

      const response = await request(app)
        .post('/api/messages')
        .set('Authorization', `Bearer ${token}`)
        .send({
          receiverId: receiver._id,
          content: 'Hello, I am interested in your service!'
        });

      expect(response.status).toBe(201);
      expect(response.body.success).toBe(true);
      expect(response.body.data.message.content).toBe('Hello, I am interested in your service!');
      expect(response.body.data.message.senderId).toHaveProperty('profile');
      expect(response.body.data.message.receiverId).toHaveProperty('profile');
    });

    it('should send message with image', async () => {
      const sender = await createTestUser('tourist');
      const receiver = await createTestUser('host');
      const token = generateTestToken(sender._id.toString(), sender.email, sender.role);

      const response = await request(app)
        .post('/api/messages')
        .set('Authorization', `Bearer ${token}`)
        .send({
          receiverId: receiver._id,
          content: 'Check this out!',
          attachments: [{
            type: 'image',
            url: 'https://example.com/image.jpg',
            size: 1024
          }]
        });

      expect(response.status).toBe(201);
      expect(response.body.data.message.attachments).toHaveLength(1);
      expect(response.body.data.message.attachments[0].url).toBe('https://example.com/image.jpg');
    });

    it('should reject empty message', async () => {
      const sender = await createTestUser('tourist');
      const receiver = await createTestUser('host');
      const token = generateTestToken(sender._id.toString(), sender.email, sender.role);

      const response = await request(app)
        .post('/api/messages')
        .set('Authorization', `Bearer ${token}`)
        .send({
          receiverId: receiver._id,
          content: '',
          attachments: []
        });

      expect(response.status).toBe(400);
      expect(response.body.message).toContain('must contain text or attachments');
    });

    it('should reject without authentication', async () => {
      const receiver = await createTestUser('host');

      const response = await request(app)
        .post('/api/messages')
        .send({
          receiverId: receiver._id,
          content: 'Test message'
        });

      expect(response.status).toBe(401);
    });

    it('should generate correct conversationId', async () => {
      const sender = await createTestUser('tourist');
      const receiver = await createTestUser('host');
      const token = generateTestToken(sender._id.toString(), sender.email, sender.role);

      const response = await request(app)
        .post('/api/messages')
        .set('Authorization', `Bearer ${token}`)
        .send({
          receiverId: receiver._id,
          content: 'Test message'
        });

      expect(response.status).toBe(201);
      expect(response.body.data.message).toHaveProperty('conversationId');
      
      // ConversationId should be consistent regardless of sender/receiver order
      const message = await Message.findById(response.body.data.message._id);
      const conversationId = message?.conversationId;
      
      // Send another message from receiver to sender
      const token2 = generateTestToken(receiver._id.toString(), receiver.email, receiver.role);
      const response2 = await request(app)
        .post('/api/messages')
        .set('Authorization', `Bearer ${token2}`)
        .send({
          receiverId: sender._id,
          content: 'Reply message'
        });

      expect(response2.body.data.message.conversationId).toBe(conversationId);
    });
  });

  describe('GET /api/messages/conversation/:otherUserId', () => {
    it('should get conversation between two users', async () => {
      const user1 = await createTestUser('tourist');
      const user2 = await createTestUser('host');
      
      // Create messages
      const conversationId = [user1._id.toString(), user2._id.toString()].sort().join('_');
      await Message.create([
        {
          conversationId,
          senderId: user1._id,
          receiverId: user2._id,
          content: 'Message 1',
          read: false
        },
        {
          conversationId,
          senderId: user2._id,
          receiverId: user1._id,
          content: 'Message 2',
          read: false
        },
        {
          conversationId,
          senderId: user1._id,
          receiverId: user2._id,
          content: 'Message 3',
          read: true
        }
      ]);
      
      const token = generateTestToken(user1._id.toString(), user1.email, user1.role);

      const response = await request(app)
        .get(`/api/messages/conversation/${user2._id}`)
        .set('Authorization', `Bearer ${token}`);

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data.messages).toHaveLength(3);
    });

    it('should paginate conversation messages', async () => {
      const user1 = await createTestUser('tourist');
      const user2 = await createTestUser('host');
      
      const conversationId = [user1._id.toString(), user2._id.toString()].sort().join('_');
      
      // Create 10 messages
      for (let i = 0; i < 10; i++) {
        await Message.create({
          conversationId,
          senderId: user1._id,
          receiverId: user2._id,
          content: `Message ${i}`,
          read: false
        });
      }
      
      const token = generateTestToken(user1._id.toString(), user1.email, user1.role);

      const response = await request(app)
        .get(`/api/messages/conversation/${user2._id}?page=1&limit=5`)
        .set('Authorization', `Bearer ${token}`);

      expect(response.status).toBe(200);
      expect(response.body.data.messages).toHaveLength(5);
    });

    it('should return empty array for new conversation', async () => {
      const user1 = await createTestUser('tourist');
      const user2 = await createTestUser('host');
      const token = generateTestToken(user1._id.toString(), user1.email, user1.role);

      const response = await request(app)
        .get(`/api/messages/conversation/${user2._id}`)
        .set('Authorization', `Bearer ${token}`);

      expect(response.status).toBe(200);
      expect(response.body.data.messages).toHaveLength(0);
    });
  });

  describe('GET /api/messages/conversations', () => {
    it('should list all user conversations', async () => {
      const user = await createTestUser('tourist');
      const contact1 = await createTestUser('host');
      const contact2 = await createTestUser('host');
      
      // Create conversations
      const conv1Id = [user._id.toString(), contact1._id.toString()].sort().join('_');
      const conv2Id = [user._id.toString(), contact2._id.toString()].sort().join('_');
      
      await Message.create([
        {
          conversationId: conv1Id,
          senderId: user._id,
          receiverId: contact1._id,
          content: 'Hi contact 1',
          read: false
        },
        {
          conversationId: conv2Id,
          senderId: contact2._id,
          receiverId: user._id,
          content: 'Hi from contact 2',
          read: false
        }
      ]);
      
      const token = generateTestToken(user._id.toString(), user.email, user.role);

      const response = await request(app)
        .get('/api/messages/conversations')
        .set('Authorization', `Bearer ${token}`);

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data.conversations).toHaveLength(2);
    });

    it('should show unread message count', async () => {
      const user = await createTestUser('tourist');
      const contact = await createTestUser('host');
      
      const conversationId = [user._id.toString(), contact._id.toString()].sort().join('_');
      
      await Message.create([
        {
          conversationId,
          senderId: contact._id,
          receiverId: user._id,
          content: 'Unread 1',
          read: false
        },
        {
          conversationId,
          senderId: contact._id,
          receiverId: user._id,
          content: 'Unread 2',
          read: false
        },
        {
          conversationId,
          senderId: user._id,
          receiverId: contact._id,
          content: 'My message',
          read: true
        }
      ]);
      
      const token = generateTestToken(user._id.toString(), user.email, user.role);

      const response = await request(app)
        .get('/api/messages/conversations')
        .set('Authorization', `Bearer ${token}`);

      expect(response.status).toBe(200);
      expect(response.body.data.conversations[0]).toHaveProperty('unreadCount');
      expect(response.body.data.conversations[0].unreadCount).toBe(2);
    });
  });

  describe('PATCH /api/messages/:id/read', () => {
    it('should mark message as read', async () => {
      const sender = await createTestUser('tourist');
      const receiver = await createTestUser('host');
      
      const message = await Message.create({
        conversationId: 'test_conv',
        senderId: sender._id,
        receiverId: receiver._id,
        content: 'Test message',
        read: false
      });
      
      const token = generateTestToken(receiver._id.toString(), receiver.email, receiver.role);

      const response = await request(app)
        .patch(`/api/messages/${message._id}/read`)
        .set('Authorization', `Bearer ${token}`);

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      
      const updatedMessage = await Message.findById(message._id);
      expect(updatedMessage?.read).toBe(true);
    });

    it('should reject marking other user\'s message as read', async () => {
      const sender = await createTestUser('tourist');
      const receiver = await createTestUser('host');
      const otherUser = await createTestUser('tourist');
      
      const message = await Message.create({
        conversationId: 'test_conv',
        senderId: sender._id,
        receiverId: receiver._id,
        content: 'Test message',
        read: false
      });
      
      const token = generateTestToken(otherUser._id.toString(), otherUser.email, otherUser.role);

      const response = await request(app)
        .patch(`/api/messages/${message._id}/read`)
        .set('Authorization', `Bearer ${token}`);

      expect(response.status).toBe(403);
    });
  });

  describe('DELETE /api/messages/:id', () => {
    it('should delete own message', async () => {
      const sender = await createTestUser('tourist');
      const receiver = await createTestUser('host');
      
      const message = await Message.create({
        conversationId: 'test_conv',
        senderId: sender._id,
        receiverId: receiver._id,
        content: 'Test message',
        read: false
      });
      
      const token = generateTestToken(sender._id.toString(), sender.email, sender.role);

      const response = await request(app)
        .delete(`/api/messages/${message._id}`)
        .set('Authorization', `Bearer ${token}`);

      expect(response.status).toBe(200);
      
      const deletedMessage = await Message.findById(message._id);
      expect(deletedMessage).toBeNull();
    });

    it('should reject deleting other user\'s message', async () => {
      const sender = await createTestUser('tourist');
      const receiver = await createTestUser('host');
      const otherUser = await createTestUser('tourist');
      
      const message = await Message.create({
        conversationId: 'test_conv',
        senderId: sender._id,
        receiverId: receiver._id,
        content: 'Test message',
        read: false
      });
      
      const token = generateTestToken(otherUser._id.toString(), otherUser.email, otherUser.role);

      const response = await request(app)
        .delete(`/api/messages/${message._id}`)
        .set('Authorization', `Bearer ${token}`);

      expect(response.status).toBe(403);
    });
  });
});
