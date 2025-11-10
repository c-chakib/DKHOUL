import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface Message {
  _id: string;
  senderId: string;
  receiverId: string;
  content: string;
  read: boolean;
  createdAt: string;
}

export interface Conversation {
  _id: string;
  participants: any[];
  lastMessage: Message;
  unreadCount: number;
}

@Injectable({
  providedIn: 'root'
})
export class MessageService {
  private apiUrl = `${environment.apiUrl}/messages`;

  constructor(private http: HttpClient) {}

  getConversations(): Observable<{ success: boolean; data: Conversation[] }> {
    return this.http.get<{ success: boolean; data: Conversation[] }>(`${this.apiUrl}/conversations`);
  }

  createConversation(userId: string): Observable<{ success: boolean; data: Conversation }> {
    return this.http.post<{ success: boolean; data: Conversation }>(`${this.apiUrl}/conversations`, {
      participantId: userId
    });
  }

  getMessages(userId: string): Observable<{ success: boolean; data: Message[] }> {
    return this.http.get<{ success: boolean; data: Message[] }>(`${this.apiUrl}/${userId}`);
  }

  getConversationMessages(conversationId: string): Observable<{ success: boolean; data: Message[] }> {
    return this.http.get<{ success: boolean; data: Message[] }>(`${this.apiUrl}/conversation/${conversationId}`);
  }

  sendMessage(receiverId: string, content: string): Observable<{ success: boolean; data: Message }> {
    return this.http.post<{ success: boolean; data: Message }>(this.apiUrl, {
      receiverId,
      content
    });
  }

  markAsRead(messageId: string): Observable<{ success: boolean }> {
    return this.http.put<{ success: boolean }>(`${this.apiUrl}/${messageId}/read`, {});
  }

  deleteMessage(messageId: string): Observable<{ success: boolean }> {
    return this.http.delete<{ success: boolean }>(`${this.apiUrl}/${messageId}`);
  }

  getGlobalMessages(limit: number = 50): Observable<{ success: boolean; data: { messages: any[] } }> {
    return this.http.get<{ success: boolean; data: { messages: any[] } }>(`${this.apiUrl}/global`, {
      params: { limit: limit.toString() }
    });
  }
}
