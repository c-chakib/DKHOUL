import { Server, Socket } from 'socket.io';
import { Server as HTTPServer } from 'http';
import { verifyAccessToken } from '../utils/jwt.util';
import Message from '../models/Message.model';
import { generateConversationId } from '../utils/helpers';

interface AuthenticatedSocket extends Socket {
  userId?: string;
  email?: string;
  role?: string;
}

interface MessageData {
  receiverId: string;
  content?: string;
  imageUrl?: string;
}

interface TypingData {
  receiverId: string;
  isTyping: boolean;
}

interface OnlineUser {
  userId: string;
  socketId: string;
}

// Store online users
const onlineUsers: Map<string, string> = new Map(); // userId -> socketId

export const initializeSocket = (server: HTTPServer) => {
  const io = new Server(server, {
    cors: {
      origin: process.env.CLIENT_URL || 'http://localhost:4200',
      credentials: true,
      methods: ['GET', 'POST'],
    },
  });

  // Authentication middleware
  io.use(async (socket: AuthenticatedSocket, next) => {
    try {
      const token = socket.handshake.auth.token || socket.handshake.headers.authorization?.split(' ')[1];
      
      if (!token) {
        return next(new Error('Authentication token required'));
      }

      const decoded = verifyAccessToken(token);
      socket.userId = decoded.userId;
      socket.email = decoded.email;
      socket.role = decoded.role;
      
      next();
    } catch (error) {
      console.error('Socket authentication failed:', error);
      next(new Error('Authentication failed'));
    }
  });

  io.on('connection', (socket: AuthenticatedSocket) => {
    console.log(`✅ User connected: ${socket.userId} (${socket.id})`);

    // Add user to online users
    if (socket.userId) {
      onlineUsers.set(socket.userId, socket.id);
      
      // Broadcast user online status
      io.emit('user-online', {
        userId: socket.userId,
        timestamp: new Date()
      });

      // Send current online users to the connected user
      const onlineUserIds = Array.from(onlineUsers.keys());
      socket.emit('online-users', onlineUserIds);
    }

    // Join user's personal room (for direct messages)
    socket.join(`user:${socket.userId}`);

    // Send message
    socket.on('send-message', async (data: MessageData) => {
      try {
        const { receiverId, content, imageUrl } = data;

        if (!socket.userId) {
          socket.emit('error', { message: 'User not authenticated' });
          return;
        }

        if (!content && !imageUrl) {
          socket.emit('error', { message: 'Message must contain text or image' });
          return;
        }

        // Generate conversation ID
        const conversationId = generateConversationId(socket.userId, receiverId);

        // Save message to database
        const message = await Message.create({
          conversationId,
          sender: socket.userId,
          receiver: receiverId,
          content,
          imageUrl,
          isRead: false
        });

        // Populate sender and receiver
        await message.populate([
          { path: 'sender', select: 'firstName lastName photo' },
          { path: 'receiver', select: 'firstName lastName photo' }
        ]);

        // Emit to sender (confirmation)
        socket.emit('message-sent', {
          success: true,
          message
        });

        // Emit to receiver if online
        const receiverSocketId = onlineUsers.get(receiverId);
        if (receiverSocketId) {
          io.to(receiverSocketId).emit('new-message', message);
          
          // Send notification
          io.to(receiverSocketId).emit('notification', {
            type: 'new-message',
            message: 'You have a new message',
            data: message
          });
        }

        console.log(`📨 Message sent from ${socket.userId} to ${receiverId}`);
      } catch (error) {
        console.error('Error sending message:', error);
        socket.emit('error', { message: 'Failed to send message' });
      }
    });

    // Mark message as read
    socket.on('mark-read', async (data: { messageId: string }) => {
      try {
        const message = await Message.findById(data.messageId);
        
        if (!message) {
          socket.emit('error', { message: 'Message not found' });
          return;
        }

        if (message.receiverId.toString() !== socket.userId) {
          socket.emit('error', { message: 'Unauthorized' });
          return;
        }

        message.read = true;
        message.readAt = new Date();
        await message.save();

        // Notify sender that message was read
        const senderSocketId = onlineUsers.get(message.senderId.toString());
        if (senderSocketId) {
          io.to(senderSocketId).emit('message-read', {
            messageId: data.messageId,
            readAt: message.readAt
          });
        }
      } catch (error) {
        console.error('Error marking message as read:', error);
        socket.emit('error', { message: 'Failed to mark message as read' });
      }
    });

    // Typing indicator
    socket.on('typing', (data: TypingData) => {
      const { receiverId, isTyping } = data;
      const receiverSocketId = onlineUsers.get(receiverId);
      
      if (receiverSocketId) {
        io.to(receiverSocketId).emit('user-typing', {
          userId: socket.userId,
          isTyping,
          timestamp: new Date()
        });
      }
    });

    // Join conversation room
    socket.on('join-conversation', (data: { otherUserId: string }) => {
      if (!socket.userId) return;
      
      const conversationId = generateConversationId(socket.userId, data.otherUserId);
      socket.join(`conversation:${conversationId}`);
      
      console.log(`User ${socket.userId} joined conversation: ${conversationId}`);
    });

    // Leave conversation room
    socket.on('leave-conversation', (data: { otherUserId: string }) => {
      if (!socket.userId) return;
      
      const conversationId = generateConversationId(socket.userId, data.otherUserId);
      socket.leave(`conversation:${conversationId}`);
      
      console.log(`User ${socket.userId} left conversation: ${conversationId}`);
    });

    // Get online status
    socket.on('check-online', (data: { userId: string }) => {
      const isOnline = onlineUsers.has(data.userId);
      socket.emit('online-status', {
        userId: data.userId,
        isOnline,
        timestamp: new Date()
      });
    });

    // Handle disconnection
    socket.on('disconnect', () => {
      console.log(`❌ User disconnected: ${socket.userId} (${socket.id})`);
      
      if (socket.userId) {
        // Remove from online users
        onlineUsers.delete(socket.userId);
        
        // Broadcast user offline status
        io.emit('user-offline', {
          userId: socket.userId,
          timestamp: new Date()
        });
      }
    });

    // Handle errors
    socket.on('error', (error) => {
      console.error(`Socket error for user ${socket.userId}:`, error);
    });
  });

  console.log('✅ Socket.IO initialized');
  return io;
};

// Get online users count
export const getOnlineUsersCount = (): number => {
  return onlineUsers.size;
};

// Check if user is online
export const isUserOnline = (userId: string): boolean => {
  return onlineUsers.has(userId);
};

// Get socket ID for user
export const getUserSocketId = (userId: string): string | undefined => {
  return onlineUsers.get(userId);
};

