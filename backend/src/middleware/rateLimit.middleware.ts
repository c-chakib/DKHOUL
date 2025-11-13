import rateLimit from 'express-rate-limit';
import { Request, Response } from 'express';

// Rate limit configurations
const RATE_LIMITS = {
  // General API: 100 requests per 15 minutes per IP
  general: {
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100,
    message: {
      error: 'Too many requests',
      message: 'Rate limit exceeded. Please try again later.',
      retryAfter: '15 minutes'
    },
    standardHeaders: true,
    legacyHeaders: false,
  },

  // Authentication: 5 attempts per hour per IP
  auth: {
    windowMs: 60 * 60 * 1000, // 1 hour
    max: 5,
    message: {
      error: 'Too many authentication attempts',
      message: 'Too many login/register attempts. Please try again in 1 hour.',
      retryAfter: '1 hour'
    },
    standardHeaders: true,
    legacyHeaders: false,
    skipSuccessfulRequests: true, // Don't count successful logins
  },

  // Sensitive operations: 10 requests per hour per IP
  sensitive: {
    windowMs: 60 * 60 * 1000, // 1 hour
    max: 10,
    message: {
      error: 'Too many sensitive operations',
      message: 'Too many sensitive operations. Please try again in 1 hour.',
      retryAfter: '1 hour'
    },
    standardHeaders: true,
    legacyHeaders: false,
  },

  // File uploads: 20 uploads per hour per IP
  upload: {
    windowMs: 60 * 60 * 1000, // 1 hour
    max: 20,
    message: {
      error: 'Too many file uploads',
      message: 'Upload limit exceeded. Please try again in 1 hour.',
      retryAfter: '1 hour'
    },
    standardHeaders: true,
    legacyHeaders: false,
  },

  // API endpoints: 200 requests per 15 minutes per IP
  api: {
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 200,
    message: {
      error: 'API rate limit exceeded',
      message: 'Too many API requests. Please try again later.',
      retryAfter: '15 minutes'
    },
    standardHeaders: true,
    legacyHeaders: false,
  }
};

// General API rate limiter
export const generalRateLimit = rateLimit({
  ...RATE_LIMITS.general,
  keyGenerator: (req: Request) => {
    // Use X-Forwarded-For header if behind proxy, otherwise use direct IP
    return req.headers['x-forwarded-for']?.toString().split(',')[0]?.trim() ||
           req.headers['x-real-ip']?.toString() ||
           req.ip ||
           'unknown';
  },
  handler: (req: Request, res: Response) => {
    const retryAfter = Math.ceil(RATE_LIMITS.general.windowMs / 1000);
    res.status(429).json({
      ...RATE_LIMITS.general.message,
      retryAfter: `${retryAfter} seconds`
    });
  }
});

// Authentication rate limiter
export const authRateLimit = rateLimit({
  ...RATE_LIMITS.auth,
  keyGenerator: (req: Request) => {
    // For auth, also consider email/username to prevent account-specific attacks
    const ip = req.headers['x-forwarded-for']?.toString().split(',')[0]?.trim() ||
               req.headers['x-real-ip']?.toString() ||
               req.ip ||
               'unknown';
    const identifier = req.body?.email || req.body?.username || 'unknown';
    return `${ip}:${identifier}`;
  },
  skip: (req: Request, res: Response) => {
    // Skip rate limiting for successful requests (status < 400)
    return res.statusCode < 400;
  },
  handler: (req: Request, res: Response) => {
    const retryAfter = Math.ceil(RATE_LIMITS.auth.windowMs / 1000);
    res.status(429).json({
      ...RATE_LIMITS.auth.message,
      retryAfter: `${retryAfter} seconds`
    });
  }
});

// Sensitive operations rate limiter
export const sensitiveRateLimit = rateLimit({
  ...RATE_LIMITS.sensitive,
  keyGenerator: (req: Request) => {
    const ip = req.headers['x-forwarded-for']?.toString().split(',')[0]?.trim() ||
               req.headers['x-real-ip']?.toString() ||
               req.ip ||
               'unknown';
    // For sensitive ops, consider user ID if authenticated
    const userId = (req as any).user?.id || 'anonymous';
    return `${ip}:${userId}`;
  },
  handler: (req: Request, res: Response) => {
    const retryAfter = Math.ceil(RATE_LIMITS.sensitive.windowMs / 1000);
    res.status(429).json({
      ...RATE_LIMITS.sensitive.message,
      retryAfter: `${retryAfter} seconds`
    });
  }
});

// File upload rate limiter
export const uploadRateLimit = rateLimit({
  ...RATE_LIMITS.upload,
  keyGenerator: (req: Request) => {
    const ip = req.headers['x-forwarded-for']?.toString().split(',')[0]?.trim() ||
               req.headers['x-real-ip']?.toString() ||
               req.ip ||
               'unknown';
    const userId = (req as any).user?.id || 'anonymous';
    return `${ip}:${userId}`;
  },
  handler: (req: Request, res: Response) => {
    const retryAfter = Math.ceil(RATE_LIMITS.upload.windowMs / 1000);
    res.status(429).json({
      ...RATE_LIMITS.upload.message,
      retryAfter: `${retryAfter} seconds`
    });
  }
});

// API endpoints rate limiter (stricter than general)
export const apiRateLimit = rateLimit({
  ...RATE_LIMITS.api,
  keyGenerator: (req: Request) => {
    const ip = req.headers['x-forwarded-for']?.toString().split(',')[0]?.trim() ||
               req.headers['x-real-ip']?.toString() ||
               req.ip ||
               'unknown';
    const userId = (req as any).user?.id || 'anonymous';
    return `${ip}:${userId}`;
  },
  handler: (req: Request, res: Response) => {
    const retryAfter = Math.ceil(RATE_LIMITS.api.windowMs / 1000);
    res.status(429).json({
      ...RATE_LIMITS.api.message,
      retryAfter: `${retryAfter} seconds`
    });
  }
});

// Create custom rate limiter for specific use cases
export const createCustomRateLimit = (options: {
  windowMs: number;
  max: number;
  message?: any;
  keyGenerator?: (req: Request) => string;
}) => {
  return rateLimit({
    windowMs: options.windowMs,
    max: options.max,
    message: options.message || {
      error: 'Rate limit exceeded',
      message: 'Too many requests. Please try again later.',
    },
    standardHeaders: true,
    legacyHeaders: false,
    keyGenerator: options.keyGenerator || ((req: Request) => {
      return req.headers['x-forwarded-for']?.toString().split(',')[0]?.trim() ||
             req.headers['x-real-ip']?.toString() ||
             req.ip ||
             'unknown';
    }),
    handler: (req: Request, res: Response) => {
      const retryAfter = Math.ceil(options.windowMs / 1000);
      res.status(429).json({
        error: 'Rate limit exceeded',
        message: 'Too many requests. Please try again later.',
        retryAfter: `${retryAfter} seconds`
      });
    }
  });
};