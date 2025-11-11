// backend/src/models/log.model.ts
import mongoose, { Schema, Document } from 'mongoose';

export interface ILog extends Document {
  level: 'debug' | 'info' | 'warn' | 'error';
  message: string;
  timestamp: Date;
  userId?: string;
  userName?: string;
  component?: string;
  action?: string;
  metadata?: {
    url?: string;
    method?: string;
    statusCode?: number;
    errorStack?: string;
    userAgent?: string;
    ip?: string;
    [key: string]: any;
  };
  createdAt: Date;
  updatedAt: Date;
}

const LogSchema: Schema = new Schema(
  {
    level: {
      type: String,
      enum: ['debug', 'info', 'warn', 'error'],
      required: true,
      index: true
    },
    message: {
      type: String,
      required: true
    },
    timestamp: {
      type: Date,
      default: Date.now,
      index: true
    },
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      index: true
    },
    userName: {
      type: String
    },
    component: {
      type: String,
      index: true
    },
    action: {
      type: String,
      index: true
    },
    metadata: {
      url: String,
      method: String,
      statusCode: Number,
      errorStack: String,
      userAgent: String,
      ip: String,
      // Additional flexible fields
      error: Schema.Types.Mixed,
      request: Schema.Types.Mixed,
      response: Schema.Types.Mixed
    }
  },
  {
    timestamps: true,
    // Auto-delete logs older than 30 days
    expires: '30d'
  }
);

// Indexes for efficient queries
LogSchema.index({ timestamp: -1 });
LogSchema.index({ level: 1, timestamp: -1 });
LogSchema.index({ userId: 1, timestamp: -1 });
LogSchema.index({ component: 1, timestamp: -1 });

export default mongoose.model<ILog>('Log', LogSchema);
