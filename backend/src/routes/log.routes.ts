// backend/src/routes/log.routes.ts
import express from 'express';
import {
  createLog,
  getLogs,
  getLogStats,
  deleteOldLogs,
  exportLogs
} from '../controllers/log.controller';
import { authenticate, authorize } from '../middleware/auth.middleware';

const router = express.Router();

// Public route - Frontend can send logs
router.post('/', createLog);

// Protected routes - Admin only
router.get('/', authenticate, authorize('admin'), getLogs);
router.get('/stats', authenticate, authorize('admin'), getLogStats);
router.post('/cleanup', authenticate, authorize('admin'), deleteOldLogs);
router.get('/export', authenticate, authorize('admin'), exportLogs);

export default router;
