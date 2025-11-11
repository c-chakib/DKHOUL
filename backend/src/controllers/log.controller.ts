// backend/src/controllers/log.controller.ts
import { Request, Response } from 'express';
import Log from '../models/log.model';

/**
 * Create a new log entry
 */
export const createLog = async (req: Request, res: Response) => {
  try {
    const { level, message, component, action, metadata } = req.body;
    
    // Get user info from authenticated request
    const userId = req.user?.id;
    const userName = req.user?.name;
    
    // Get IP and user agent
    const ip = req.ip || req.connection.remoteAddress;
    const userAgent = req.headers['user-agent'];
    
    const log = new Log({
      level,
      message,
      userId,
      userName,
      component,
      action,
      metadata: {
        ...metadata,
        ip,
        userAgent,
        url: req.originalUrl,
        method: req.method
      }
    });
    
    await log.save();
    
    // Emit to socket for real-time updates
    if (req.app.get('io')) {
      req.app.get('io').to('admin-logs').emit('new-log', log);
    }
    
    res.status(201).json({
      success: true,
      message: 'Log created successfully'
    });
  } catch (error: any) {
    console.error('Error creating log:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create log',
      error: error.message
    });
  }
};

/**
 * Get all logs with filtering and pagination
 */
export const getLogs = async (req: Request, res: Response) => {
  try {
    const {
      page = 1,
      limit = 50,
      level,
      component,
      userId,
      startDate,
      endDate,
      search
    } = req.query;
    
    // Build query
    const query: any = {};
    
    if (level) query.level = level;
    if (component) query.component = component;
    if (userId) query.userId = userId;
    
    // Date range filter
    if (startDate || endDate) {
      query.timestamp = {};
      if (startDate) query.timestamp.$gte = new Date(startDate as string);
      if (endDate) query.timestamp.$lte = new Date(endDate as string);
    }
    
    // Text search
    if (search) {
      query.$or = [
        { message: { $regex: search, $options: 'i' } },
        { component: { $regex: search, $options: 'i' } },
        { action: { $regex: search, $options: 'i' } }
      ];
    }
    
    const skip = (Number(page) - 1) * Number(limit);
    
    const [logs, total] = await Promise.all([
      Log.find(query)
        .populate('userId', 'name email')
        .sort({ timestamp: -1 })
        .skip(skip)
        .limit(Number(limit))
        .lean(),
      Log.countDocuments(query)
    ]);
    
    res.json({
      success: true,
      data: {
        logs,
        pagination: {
          page: Number(page),
          limit: Number(limit),
          total,
          pages: Math.ceil(total / Number(limit))
        }
      }
    });
  } catch (error: any) {
    console.error('Error fetching logs:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch logs',
      error: error.message
    });
  }
};

/**
 * Get log statistics
 */
export const getLogStats = async (req: Request, res: Response) => {
  try {
    const { startDate, endDate } = req.query;
    
    const matchQuery: any = {};
    if (startDate || endDate) {
      matchQuery.timestamp = {};
      if (startDate) matchQuery.timestamp.$gte = new Date(startDate as string);
      if (endDate) matchQuery.timestamp.$lte = new Date(endDate as string);
    }
    
    // Get counts by level
    const levelStats = await Log.aggregate([
      { $match: matchQuery },
      {
        $group: {
          _id: '$level',
          count: { $sum: 1 }
        }
      }
    ]);
    
    // Get counts by component
    const componentStats = await Log.aggregate([
      { $match: matchQuery },
      {
        $group: {
          _id: '$component',
          count: { $sum: 1 }
        }
      },
      { $sort: { count: -1 } },
      { $limit: 10 }
    ]);
    
    // Get error trends (last 24 hours by hour)
    const twentyFourHoursAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
    const errorTrends = await Log.aggregate([
      {
        $match: {
          level: 'error',
          timestamp: { $gte: twentyFourHoursAgo }
        }
      },
      {
        $group: {
          _id: {
            $dateToString: {
              format: '%Y-%m-%d %H:00',
              date: '$timestamp'
            }
          },
          count: { $sum: 1 }
        }
      },
      { $sort: { _id: 1 } }
    ]);
    
    // Get recent critical errors
    const recentErrors = await Log.find({ level: 'error' })
      .sort({ timestamp: -1 })
      .limit(5)
      .populate('userId', 'name email')
      .lean();
    
    // Get total counts
    const totalLogs = await Log.countDocuments(matchQuery);
    const todayLogs = await Log.countDocuments({
      ...matchQuery,
      timestamp: { $gte: new Date(new Date().setHours(0, 0, 0, 0)) }
    });
    
    res.json({
      success: true,
      data: {
        totalLogs,
        todayLogs,
        levelStats: levelStats.reduce((acc: any, stat) => {
          acc[stat._id] = stat.count;
          return acc;
        }, {}),
        componentStats,
        errorTrends,
        recentErrors
      }
    });
  } catch (error: any) {
    console.error('Error fetching log stats:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch log statistics',
      error: error.message
    });
  }
};

/**
 * Delete old logs
 */
export const deleteOldLogs = async (req: Request, res: Response) => {
  try {
    const { days = 30 } = req.body;
    
    const dateThreshold = new Date();
    dateThreshold.setDate(dateThreshold.getDate() - days);
    
    const result = await Log.deleteMany({
      timestamp: { $lt: dateThreshold }
    });
    
    res.json({
      success: true,
      message: `Deleted ${result.deletedCount} old logs`,
      data: {
        deletedCount: result.deletedCount
      }
    });
  } catch (error: any) {
    console.error('Error deleting old logs:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete old logs',
      error: error.message
    });
  }
};

/**
 * Export logs to CSV
 */
export const exportLogs = async (req: Request, res: Response) => {
  try {
    const { startDate, endDate, level, component } = req.query;
    
    const query: any = {};
    if (level) query.level = level;
    if (component) query.component = component;
    if (startDate || endDate) {
      query.timestamp = {};
      if (startDate) query.timestamp.$gte = new Date(startDate as string);
      if (endDate) query.timestamp.$lte = new Date(endDate as string);
    }
    
    const logs = await Log.find(query)
      .populate('userId', 'name email')
      .sort({ timestamp: -1 })
      .lean();
    
    // Convert to CSV
    const csvHeader = 'Timestamp,Level,Message,Component,Action,User,URL\n';
    const csvRows = logs.map(log => {
      const timestamp = new Date(log.timestamp).toISOString();
      const level = log.level;
      const message = `"${(log.message || '').replace(/"/g, '""')}"`;
      const component = log.component || '';
      const action = log.action || '';
      const user = log.userName || '';
      const url = log.metadata?.url || '';
      
      return `${timestamp},${level},${message},${component},${action},${user},${url}`;
    }).join('\n');
    
    const csv = csvHeader + csvRows;
    
    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', `attachment; filename=logs-${Date.now()}.csv`);
    res.send(csv);
  } catch (error: any) {
    console.error('Error exporting logs:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to export logs',
      error: error.message
    });
  }
};
