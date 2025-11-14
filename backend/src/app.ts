import express, { Application } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import dotenv from 'dotenv';

// Import routes
import authRoutes from './routes/auth.routes';
import serviceRoutes from './routes/service.routes';
import bookingRoutes from './routes/booking.routes';
import paymentRoutes from './routes/payment.routes';
import reviewRoutes from './routes/review.routes';
import messageRoutes from './routes/message.routes';
import userRoutes from './routes/user.routes';
import adminRoutes from './routes/admin.routes';
import uploadRoutes from './routes/upload.routes';
import logRoutes from './routes/log.routes';

// Import middleware
import { errorHandler, notFound } from './middleware/error.middleware';
import { securityHeaders } from './middleware/security.middleware';
import {
  generalRateLimit,
  authRateLimit,
  sensitiveRateLimit,
  uploadRateLimit,
  apiRateLimit
} from './middleware/rateLimit.middleware';
import { setupSwagger } from './config/swagger';
import { initSentry } from './config/sentry';

dotenv.config();

// Initialize Sentry (must be done before any other code)
initSentry();

const app: Application = express();

// Security middleware
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
      fontSrc: ["'self'", "https://fonts.gstatic.com"],
      scriptSrc: ["'self'"],
      imgSrc: ["'self'", "data:", "https:", "blob:"],
      connectSrc: ["'self'", "https://api.stripe.com", "https://js.stripe.com"],
      frameSrc: ["'self'", "https://js.stripe.com", "https://hooks.stripe.com"],
      objectSrc: ["'none'"],
      upgradeInsecureRequests: [],
    },
  },
  hsts: {
    maxAge: 31536000,
    includeSubDomains: true,
    preload: true
  },
  crossOriginOpenerPolicy: { policy: 'same-origin-allow-popups' },
  crossOriginResourcePolicy: { policy: 'cross-origin' },
  dnsPrefetchControl: { allow: false },
  frameguard: { action: 'deny' },
  hidePoweredBy: true,
  ieNoOpen: true,
  noSniff: true,
  referrerPolicy: { policy: 'strict-origin-when-cross-origin' },
  xssFilter: true,
}));

// Additional security headers
app.use(securityHeaders);
// Explicitly ensure header present even if future middleware changes Helmet config
app.use((_req, res, next) => {
  res.setHeader('Cross-Origin-Opener-Policy', 'same-origin-allow-popups');
  return next();
});

// Flexible CORS: allow single or comma-separated origins, plus Vercel previews by default
const rawOrigins = process.env.CLIENT_URL || 'http://localhost:4200';
const allowedOrigins = rawOrigins.split(',').map(o => o.trim()).filter(Boolean);
const corsOptions: cors.CorsOptions = {
  origin: (origin, callback) => {
    // Allow server-to-server or curl without origin
    if (!origin) return callback(null, true);
    // Exact match against allowed list
    if (allowedOrigins.includes(origin)) return callback(null, true);
    // Allow Vercel preview domains automatically
    if (origin.endsWith('.vercel.app')) return callback(null, true);
    return callback(new Error(`CORS blocked: ${origin}`));
  },
  credentials: true,
};
app.use(cors(corsOptions));

// Rate limiting - apply different limits to different route types
// General API rate limiting (applied to all routes)
app.use('/api/', generalRateLimit);

// Stricter rate limiting for authentication routes
app.use('/api/auth', authRateLimit);

// Rate limiting for sensitive operations (payments, admin)
app.use('/api/payments', sensitiveRateLimit);
app.use('/api/admin', sensitiveRateLimit);

// Rate limiting for file uploads
app.use('/api/upload', uploadRateLimit);

// Stricter rate limiting for API-heavy routes
app.use('/api/messages', apiRateLimit);
app.use('/api/logs', apiRateLimit);

// Body parsing middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve uploaded files statically (development only)
if (process.env.NODE_ENV !== 'production') {
  app.use('/uploads', express.static('uploads'));
}

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/services', serviceRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api/reviews', reviewRoutes);
app.use('/api/messages', messageRoutes);
app.use('/api/users', userRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/upload', uploadRoutes);
app.use('/api/logs', logRoutes);

// Health check
app.get('/health', (_req, res) => {
  res.json({ success: true, message: 'Server is running' });
});

// API Documentation
setupSwagger(app);

// Error handling
app.use(notFound);
app.use(errorHandler);

export default app;
