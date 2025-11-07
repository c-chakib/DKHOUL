import express, { Application } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
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

// Import middleware
import { errorHandler, notFound } from './middleware/error.middleware';

dotenv.config();

const app: Application = express();

// Security middleware
app.use(helmet());

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

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
});
app.use('/api/', limiter);

// Body parsing middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/services', serviceRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api/reviews', reviewRoutes);
app.use('/api/messages', messageRoutes);
app.use('/api/users', userRoutes);
app.use('/api/admin', adminRoutes);

// Health check
app.get('/health', (req, res) => {
  res.json({ success: true, message: 'Server is running' });
});

// Error handling
app.use(notFound);
app.use(errorHandler);

export default app;
