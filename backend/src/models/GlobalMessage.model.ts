import mongoose, { Schema, Document } from 'mongoose';

export interface IGlobalMessage extends Document {
  senderId: mongoose.Types.ObjectId;
  content: string;
  createdAt: Date;
}

const globalMessageSchema = new Schema<IGlobalMessage>({
  senderId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  content: {
    type: String,
    required: true,
    trim: true
  },
  createdAt: {
    type: Date,
    default: Date.now,
    index: true
  }
});

// Index for efficient querying
globalMessageSchema.index({ createdAt: -1 });

const GlobalMessage = mongoose.model<IGlobalMessage>('GlobalMessage', globalMessageSchema);

export default GlobalMessage;
