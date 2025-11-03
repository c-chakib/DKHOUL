import { Request, Response, NextFunction } from 'express';
import Message from '../models/Message.model';
import { AppError } from '../middleware/error.middleware';
import { generateConversationId } from '../utils/helpers';

// Send message
export const sendMessage = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const senderId = (req as any).user.userId;
    const { receiverId, content, imageUrl } = req.body;

    if (!content && !imageUrl) {
      return next(new AppError('Message must contain text or image', 400));
    }

    const conversationId = generateConversationId(senderId, receiverId);

    const message = await Message.create({
      conversationId,
      sender: senderId,
      receiver: receiverId,
      content,
      imageUrl,
      isRead: false
    });

    await message.populate([
      { path: 'sender', select: 'firstName lastName photo' },
      { path: 'receiver', select: 'firstName lastName photo' }
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
      .populate('sender', 'firstName lastName photo')
      .populate('receiver', 'firstName lastName photo')
      .sort('-createdAt')
      .skip(skip)
      .limit(limitNum);

    const total = await Message.countDocuments({ conversationId });

    // Mark messages as read
    await Message.updateMany(
      {
        conversationId,
        receiver: userId,
        isRead: false
      },
      {
        isRead: true,
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

// Get all conversations for user
export const getConversations = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = (req as any).user.userId;

    // Get unique conversations
    const conversations = await Message.aggregate([
      {
        $match: {
          $or: [{ sender: userId }, { receiver: userId }]
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
                { $and: [{ $eq: ['$receiver', userId] }, { $eq: ['$isRead', false] }] },
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
      { path: 'lastMessage.sender', select: 'firstName lastName photo' },
      { path: 'lastMessage.receiver', select: 'firstName lastName photo' }
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
    if (message.receiver.toString() !== userId) {
      return next(new AppError('Not authorized to mark this message as read', 403));
    }

    message.isRead = true;
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
    if (message.sender.toString() !== userId) {
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
      receiver: userId,
      isRead: false
    });

    res.json({
      success: true,
      data: { unreadCount: count }
    });
  } catch (error) {
    next(error);
  }
};

