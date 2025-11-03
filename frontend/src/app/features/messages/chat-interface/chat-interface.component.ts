import { Component, OnInit, OnDestroy, ViewChild, ElementRef, AfterViewChecked } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MessageService } from '../../../core/services/message.service';
import { SocketService } from '../../../core/services/socket.service';

@Component({
  selector: 'app-chat-interface',
  standalone: true,
  imports: [CommonModule, FormsModule, MatFormFieldModule, MatInputModule, MatButtonModule, MatIconModule, MatProgressSpinnerModule],
  templateUrl: './chat-interface.component.html',
  styleUrl: './chat-interface.component.scss'
})
export class ChatInterfaceComponent implements OnInit, OnDestroy, AfterViewChecked {
  @ViewChild('messagesContainer') messagesContainer!: ElementRef;
  
  conversationId: string = '';
  messages: any[] = [];
  otherUser: any = null;
  newMessage = '';
  loading = true;
  sending = false;
  currentUserId: string = '';
  private shouldScrollToBottom = false;

  constructor(
    private route: ActivatedRoute,
    private messageService: MessageService,
    private socketService: SocketService
  ) {}

  ngOnInit(): void {
    this.conversationId = this.route.snapshot.paramMap.get('id') || '';
    this.loadConversation();
    this.setupSocketListeners();
  }

  ngAfterViewChecked(): void {
    if (this.shouldScrollToBottom) {
      this.scrollToBottom();
      this.shouldScrollToBottom = false;
    }
  }

  ngOnDestroy(): void {
    this.socketService.disconnect();
  }

  loadConversation(): void {
    this.messageService.getMessages(this.conversationId).subscribe({
      next: (data: any) => {
        this.messages = data.messages;
        this.otherUser = data.otherUser;
        this.loading = false;
        this.shouldScrollToBottom = true;
        this.markAsRead();
      },
      error: (error: any) => {
        console.error('Error loading conversation:', error);
        this.loading = false;
      }
    });
  }

  setupSocketListeners(): void {
    // Get token from local storage
    const token = localStorage.getItem('token') || '';
    this.socketService.connect(token);
    
    // Use onMessage instead of onNewMessage
    this.socketService.onMessage().subscribe((message: any) => {
      if (message.conversationId === this.conversationId) {
        this.messages.push(message);
        this.shouldScrollToBottom = true;
        this.markAsRead();
      }
    });
  }

  sendMessage(): void {
    if (!this.newMessage.trim() || this.sending) return;

    this.sending = true;
    const receiverId = this.otherUser._id;
    const content = this.newMessage;

    this.messageService.sendMessage(receiverId, content).subscribe({
      next: (response: any) => {
        this.messages.push(response.data);
        this.newMessage = '';
        this.shouldScrollToBottom = true;
        this.sending = false;
        
        // Emit socket event
        this.socketService.sendMessage(response.data);
      },
      error: (error: any) => {
        console.error('Error sending message:', error);
        this.sending = false;
      }
    });
  }

  markAsRead(): void {
    this.messageService.markAsRead(this.conversationId).subscribe({
      next: () => {},
      error: (error: any) => console.error('Error marking as read:', error)
    });
  }

  scrollToBottom(): void {
    try {
      this.messagesContainer.nativeElement.scrollTop = this.messagesContainer.nativeElement.scrollHeight;
    } catch (err) {}
  }

  isOwnMessage(message: any): boolean {
    return message.sender._id === this.currentUserId;
  }
}
