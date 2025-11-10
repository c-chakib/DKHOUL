import { Router } from 'express';
import {
  sendMessage,
  getConversation,
  getConversations,
  createConversation,
  markAsRead,
  deleteMessage,
  getUnreadCount,
  getGlobalMessages
} from '../controllers/message.controller';
import { authenticate } from '../middleware/auth.middleware';

const router = Router();

// All routes are protected
router.use(authenticate);

router.post('/', sendMessage);
router.get('/conversations', getConversations);
router.post('/conversations', createConversation);
router.get('/conversation/:otherUserId', getConversation);
router.get('/global', getGlobalMessages);
router.get('/unread-count', getUnreadCount);
router.patch('/:id/read', markAsRead);
router.delete('/:id', deleteMessage);

export default router;

