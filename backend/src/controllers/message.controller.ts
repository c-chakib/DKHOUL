import { Request, Response, NextFunction } from 'express';
import Message from '../models/Message.model';
import GlobalMessage from '../models/GlobalMessage.model';
import { AppError } from '../middleware/error.middleware';
import { generateConversationId } from '../utils/helpers';

// Send message
export const sendMessage = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const senderId = (req as any).user.userId;
    const { receiverId, content, attachments } = req.body;

    if (!content && (!attachments || attachments.length === 0)) {
      return next(new AppError('Message must contain text or attachments', 400));
    }

    const conversationId = generateConversationId(senderId, receiverId);

    const message = await Message.create({
      conversationId,
      senderId,
      receiverId,
      content,
      attachments: attachments || [],
      read: false
    });

    await message.populate([
      { path: 'senderId', select: 'profile.firstName profile.lastName profile.photo' },
      { path: 'receiverId', select: 'profile.firstName profile.lastName profile.photo' }
    ]);

    // Emit socket event would be handled by socket.io
    res.status(201).json({
      success: true,
      data: { message }
    });
  } catch (error) {
    next(error);
  }
};

// Get conversation between two users
export const getConversation = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = (req as any).user.userId;
    const { otherUserId } = req.params;
    const { page = '1', limit = '50' } = req.query;

    const conversationId = generateConversationId(userId, otherUserId);

    const pageNum = parseInt(page as string);
    const limitNum = parseInt(limit as string);
    const skip = (pageNum - 1) * limitNum;

    const messages = await Message.find({ conversationId })
      .populate('senderId', 'profile.firstName profile.lastName profile.photo')
      .populate('receiverId', 'profile.firstName profile.lastName profile.photo')
      .sort('-createdAt')
      .skip(skip)
      .limit(limitNum);

    const total = await Message.countDocuments({ conversationId });

    // Mark messages as read
    await Message.updateMany(
      {
        conversationId,
        receiverId: userId,
        read: false
      },
      {
        read: true,
        readAt: new Date()
      }
    );

    res.json({
      success: true,
      data: {
        messages: messages.reverse(), // Reverse to show oldest first
        pagination: {
          page: pageNum,
          limit: limitNum,
          total,
          pages: Math.ceil(total / limitNum)
        }
      }
    });
  } catch (error) {
    next(error);
  }
};

// Create or get existing conversation
export const createConversation = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = (req as any).user.userId;
    const { participantId } = req.body;

    if (!participantId) {
      return next(new AppError('Participant ID is required', 400));
    }

    // Generate conversation ID
    const conversationId = generateConversationId(userId, participantId);

    // Check if conversation already exists
    const existingMessage = await Message.findOne({ conversationId })
      .sort({ createdAt: -1 })
      .populate([
        { path: 'senderId', select: 'name email avatar' },
        { path: 'receiverId', select: 'name email avatar' }
      ]);

    if (existingMessage) {
      // Return existing conversation
      return res.json({
        success: true,
        data: {
          _id: conversationId,
          participants: [existingMessage.senderId, existingMessage.receiverId],
          lastMessage: existingMessage,
          unreadCount: 0
        }
      });
    }

    // Create initial conversation marker (empty message)
    const initialMessage = await Message.create({
      conversationId,
      senderId: userId,
      receiverId: participantId,
      content: '', // Empty initial message
      read: true
    });

    await initialMessage.populate([
      { path: 'senderId', select: 'name email avatar' },
      { path: 'receiverId', select: 'name email avatar' }
    ]);

    res.status(201).json({
      success: true,
      data: {
        _id: conversationId,
        participants: [initialMessage.senderId, initialMessage.receiverId],
        lastMessage: initialMessage,
        unreadCount: 0
      }
    });
  } catch (error) {
    next(error);
  }
};

// Get all conversations for user
export const getConversations = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = (req as any).user.userId;
    const userObjectId = new (require('mongoose').Types.ObjectId)(userId);

    // Get unique conversations
    const conversations = await Message.aggregate([
      {
        $match: {
          $or: [{ senderId: userObjectId }, { receiverId: userObjectId }]
        }
      },
      {
        $sort: { createdAt: -1 }
      },
      {
        $group: {
          _id: '$conversationId',
          lastMessage: { $first: '$$ROOT' },
          unreadCount: {
            $sum: {
              $cond: [
                { $and: [{ $eq: ['$receiverId', userObjectId] }, { $eq: ['$read', false] }] },
                1,
                0
              ]
            }
          }
        }
      },
      {
        $sort: { 'lastMessage.createdAt': -1 }
      }
    ]);

    // Populate sender and receiver
    await Message.populate(conversations, [
      { path: 'lastMessage.senderId', select: 'profile.firstName profile.lastName profile.photo' },
      { path: 'lastMessage.receiverId', select: 'profile.firstName profile.lastName profile.photo' }
    ]);

    res.json({
      success: true,
      data: { conversations }
    });
  } catch (error) {
    next(error);
  }
};

// Mark message as read
export const markAsRead = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const userId = (req as any).user.userId;

    const message = await Message.findById(id);
    if (!message) {
      return next(new AppError('Message not found', 404));
    }

    // Check authorization
    if (message.receiverId.toString() !== userId) {
      return next(new AppError('Not authorized to mark this message as read', 403));
    }

    message.read = true;
    message.readAt = new Date();
    await message.save();

    res.json({
      success: true,
      message: 'Message marked as read'
    });
  } catch (error) {
    next(error);
  }
};

// Delete message
export const deleteMessage = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const userId = (req as any).user.userId;

    const message = await Message.findById(id);
    if (!message) {
      return next(new AppError('Message not found', 404));
    }

    // Check authorization
    if (message.senderId.toString() !== userId) {
      return next(new AppError('Not authorized to delete this message', 403));
    }

    await message.deleteOne();

    res.json({
      success: true,
      message: 'Message deleted successfully'
    });
  } catch (error) {
    next(error);
  }
};

// Get unread message count
export const getUnreadCount = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = (req as any).user.userId;

    const count = await Message.countDocuments({
      receiverId: userId,
      read: false
    });

    res.json({
      success: true,
      data: { unreadCount: count }
    });
  } catch (error) {
    next(error);
  }
};

// Get global messages
export const getGlobalMessages = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { limit = '50' } = req.query;
    const limitNum = parseInt(limit as string);

    const messages = await GlobalMessage.find()
      .populate('senderId', 'profile.firstName profile.lastName profile.avatar email')
      .sort({ createdAt: -1 })
      .limit(limitNum);

    res.json({
      success: true,
      data: { messages: messages.reverse() } // Reverse to show oldest first
    });
  } catch (error) {
    next(error);
  }
};

