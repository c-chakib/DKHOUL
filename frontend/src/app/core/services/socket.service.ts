import { Injectable } from '@angular/core';
import { io, Socket } from 'socket.io-client';
import { Observable, BehaviorSubject } from 'rxjs';
import { Message } from '../../models/message';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class SocketService {
  private socket: Socket | null = null;
  private serverUrl = environment.socketUrl;
  private unreadCountSubject = new BehaviorSubject<number>(0);
  public unreadCount$ = this.unreadCountSubject.asObservable();
  private onlineUsersSubject = new BehaviorSubject<string[]>([]);
  public onlineUsers$ = this.onlineUsersSubject.asObservable();

  constructor() { }

  connect(token: string): void {
    if (!this.socket) {
      this.socket = io(this.serverUrl, {
        auth: { token },
        transports: ['websocket'],
        reconnection: true,
        reconnectionDelay: 1000,
        reconnectionAttempts: 5
      });

      this.socket.on('connect', () => {
        console.log('✅ Socket connected:', this.socket?.id);
      });

      this.socket.on('disconnect', () => {
        console.log('❌ Socket disconnected');
      });

      // Listen for new messages to update unread count
      this.socket.on('new-message', (message: any) => {
        console.log('📨 New message received:', message);
        const currentCount = this.unreadCountSubject.value;
        this.unreadCountSubject.next(currentCount + 1);
      });

      // Listen for notification events
      this.socket.on('notification', (data: any) => {
        console.log('🔔 Notification:', data);
      });

      // Listen for online users
      this.socket.on('online-users', (userIds: string[]) => {
        console.log('👥 Online users:', userIds.length);
        this.onlineUsersSubject.next(userIds);
      });

      // Listen for user status changes
      this.socket.on('user-online', (userId: string) => {
        const current = this.onlineUsersSubject.value;
        if (!current.includes(userId)) {
          this.onlineUsersSubject.next([...current, userId]);
        }
      });

      this.socket.on('user-offline', (userId: string) => {
        const current = this.onlineUsersSubject.value;
        this.onlineUsersSubject.next(current.filter(id => id !== userId));
      });
    }
  }

  disconnect(): void {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
    }
  }

  joinRoom(roomId: string): void {
    if (this.socket) {
      this.socket.emit('join-room', roomId);
    }
  }

  leaveRoom(roomId: string): void {
    if (this.socket) {
      this.socket.emit('leave-room', roomId);
    }
  }

  sendMessage(message: Partial<Message>): void {
    if (this.socket) {
      this.socket.emit('send-message', message);
    }
  }

  onMessage(): Observable<Message> {
    return new Observable(observer => {
      if (this.socket) {
        this.socket.on('receive-message', (message: Message) => {
          observer.next(message);
        });
      }
    });
  }

  onTyping(): Observable<{ userId: string; isTyping: boolean }> {
    return new Observable(observer => {
      if (this.socket) {
        this.socket.on('user-typing', (data) => {
          observer.next(data);
        });
      }
    });
  }

  emitTyping(roomId: string, isTyping: boolean): void {
    if (this.socket) {
      this.socket.emit('typing', { roomId, isTyping });
    }
  }

  isConnected(): boolean {
    return this.socket ? this.socket.connected : false;
  }

  // Global chat methods
  joinGlobalChat(): void {
    if (this.socket) {
      this.socket.emit('join-global-chat');
      console.log('📢 Joined global chat');
    }
  }

  leaveGlobalChat(): void {
    if (this.socket) {
      this.socket.emit('leave-global-chat');
      console.log('📢 Left global chat');
    }
  }

  sendGlobalMessage(message: string): void {
    if (this.socket) {
      this.socket.emit('global-message', { content: message });
    }
  }

  onGlobalMessage(): Observable<any> {
    return new Observable(observer => {
      if (this.socket) {
        this.socket.on('global-message', (message: any) => {
          observer.next(message);
        });
      }
    });
  }

  // Notification methods
  onNotification(): Observable<any> {
    return new Observable(observer => {
      if (this.socket) {
        this.socket.on('notification', (notification: any) => {
          observer.next(notification);
        });
      }
    });
  }

  setUnreadCount(count: number): void {
    this.unreadCountSubject.next(count);
  }

  decrementUnreadCount(): void {
    const currentCount = this.unreadCountSubject.value;
    if (currentCount > 0) {
      this.unreadCountSubject.next(currentCount - 1);
    }
  }

  resetUnreadCount(): void {
    this.unreadCountSubject.next(0);
  }
}

