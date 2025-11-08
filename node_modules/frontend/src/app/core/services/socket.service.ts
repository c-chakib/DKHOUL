import { Injectable } from '@angular/core';
import { io, Socket } from 'socket.io-client';
import { Observable } from 'rxjs';
import { Message } from '../../models/message';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class SocketService {
  private socket: Socket | null = null;
  private serverUrl = environment.socketUrl;

  constructor() { }

  connect(token: string): void {
    if (!this.socket) {
      this.socket = io(this.serverUrl, {
        auth: { token },
        transports: ['websocket']
      });

      this.socket.on('connect', () => {
        console.log('Socket connected');
      });

      this.socket.on('disconnect', () => {
        console.log('Socket disconnected');
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
}

