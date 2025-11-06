import mongoose, { Schema, Document } from 'mongoose';

export interface IMessage extends Document {
  conversationId: string;
  senderId: mongoose.Types.ObjectId;
  receiverId: mongoose.Types.ObjectId;
  bookingId?: mongoose.Types.ObjectId;
  content: string;
  attachments: Array<{
    type: 'image';
    url: string;
    size: number;
  }>;
  read: boolean;
  // compatibility alias used by tests
  isRead?: boolean;
  readAt?: Date;
  createdAt: Date;
}

const MessageSchema = new Schema<IMessage>(
  {
    conversationId: {
      type: String,
      required: true,
      index: true
    },
    senderId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    receiverId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    bookingId: {
      type: Schema.Types.ObjectId,
      ref: 'Booking'
    },
    content: {
      type: String,
      required: [true, 'Message content is required'],
      maxlength: [2000, 'Message cannot exceed 2000 characters']
    },
    attachments: [{
      type: {
        type: String,
        enum: ['image'],
        required: true
      },
      url: {
        type: String,
        required: true
      },
      size: {
        type: Number,
        required: true,
        max: [5 * 1024 * 1024, 'File size cannot exceed 5MB']
      }
    }],
    read: {
      type: Boolean,
      default: false
    },
    readAt: Date
  },
  {
    timestamps: true
  }
);

// Indexes
MessageSchema.index({ conversationId: 1, createdAt: -1 });

// Virtual to support both `read` and `isRead` access patterns
MessageSchema.virtual('isRead')
  .get(function(this: IMessage) {
    return this.read;
  })
  .set(function(this: IMessage, value: boolean) {
    this.read = value;
  });

MessageSchema.set('toJSON', { virtuals: true });
MessageSchema.set('toObject', { virtuals: true });
MessageSchema.index({ senderId: 1, receiverId: 1 });

export default mongoose.model<IMessage>('Message', MessageSchema);
