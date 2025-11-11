// backend/src/routes/log.routes.ts
import express from 'express';
import {
  createLog,
  getLogs,
  getLogStats,
  deleteOldLogs,
  exportLogs
} from '../controllers/log.controller';
import { authenticateToken } from '../middleware/auth.middleware';
import { authorizeRoles } from '../middleware/role.middleware';

const router = express.Router();

// Public route - Frontend can send logs
router.post('/', createLog);

// Protected routes - Admin only
router.get('/', authenticateToken, authorizeRoles('admin'), getLogs);
router.get('/stats', authenticateToken, authorizeRoles('admin'), getLogStats);
router.post('/cleanup', authenticateToken, authorizeRoles('admin'), deleteOldLogs);
router.get('/export', authenticateToken, authorizeRoles('admin'), exportLogs);

export default router;
