export interface Message {
  _id: string;
  conversationId: string;
  senderId: string;
  receiverId: string;
  content: string;
  type: 'text' | 'image' | 'file' | 'booking';
  metadata?: {
    fileName?: string;
    fileUrl?: string;
    bookingId?: string;
  };
  read: boolean;
  readAt?: Date;
  createdAt: Date;
}

export interface Conversation {
  _id: string;
  participants: string[];
  lastMessage: Message;
  unreadCount: number;
  updatedAt: Date;
}

