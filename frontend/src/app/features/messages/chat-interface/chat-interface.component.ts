import { Component, OnInit, OnDestroy, ViewChild, ElementRef, AfterViewChecked } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTabsModule } from '@angular/material/tabs';
import { MatCardModule } from '@angular/material/card';
import { MatDividerModule } from '@angular/material/divider';
import { MatBadgeModule } from '@angular/material/badge';
import { Subscription } from 'rxjs';
import { MessageService } from '../../../core/services/message.service';
import { SocketService } from '../../../core/services/socket.service';
import { AuthService } from '../../../core/services/auth.service';
import { UserService } from '../../../core/services/user.service';

@Component({
  selector: 'app-chat-interface',
  standalone: true,
  imports: [
    CommonModule, 
    FormsModule, 
    MatFormFieldModule, 
    MatInputModule, 
    MatButtonModule, 
    MatIconModule, 
    MatProgressSpinnerModule,
    MatTabsModule,
    MatCardModule,
    MatDividerModule,
    MatBadgeModule
  ],
  templateUrl: './chat-interface.component.html',
  styleUrl: './chat-interface.component.scss'
})
export class ChatInterfaceComponent implements OnInit, OnDestroy, AfterViewChecked {
  @ViewChild('messagesContainer') messagesContainer!: ElementRef;
  @ViewChild('globalMessagesContainer') globalMessagesContainer!: ElementRef;
  
  // Tab selection
  selectedTabIndex = 0;
  
  // Users sidebar
  allUsers: any[] = [];
  filteredUsers: any[] = [];
  searchQuery = '';
  selectedUserId: string = '';
  selectedUser: any = null;
  onlineUserIds: string[] = [];
  
  // Private chat
  conversationId: string = '';
  messages: any[] = [];
  otherUser: any = null;
  newMessage = '';
  loading = true;
  sending = false;
  currentUserId: string = '';
  currentUser: any = null;
  
  // Global chat
  globalMessages: any[] = [];
  globalNewMessage = '';
  onlineUsersCount = 0;
  
  private shouldScrollToBottom = false;
  private shouldScrollGlobalToBottom = false;
  private subscriptions: Subscription[] = [];

  constructor(
    private route: ActivatedRoute,
    private messageService: MessageService,
    private socketService: SocketService,
    private authService: AuthService,
    private userService: UserService
  ) {}

  ngOnInit(): void {
    // Get current user
    this.currentUser = this.authService.currentUserValue;
    this.currentUserId = this.currentUser?._id || '';
    
    // Load all users
    this.loadAllUsers();
    
    // Check if there's a conversation ID in route
    this.conversationId = this.route.snapshot.paramMap.get('id') || '';
    
    if (this.conversationId) {
      this.selectedTabIndex = 0; // Private chat tab
      this.loadConversation();
    } else {
      this.loading = false;
    }
    
    this.setupSocketListeners();
    this.subscribeToOnlineUsers();
  }

  ngAfterViewChecked(): void {
    if (this.shouldScrollToBottom) {
      this.scrollToBottom();
      this.shouldScrollToBottom = false;
    }
    if (this.shouldScrollGlobalToBottom) {
      this.scrollGlobalToBottom();
      this.shouldScrollGlobalToBottom = false;
    }
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(sub => sub.unsubscribe());
    this.socketService.leaveGlobalChat();
    this.socketService.disconnect();
  }

  loadConversation(): void {
    this.messageService.getMessages(this.conversationId).subscribe({
      next: (data: any) => {
        // Normalize response shapes
        const rawMessages = data?.messages || data?.data?.messages || data?.data || data;
        this.messages = Array.isArray(rawMessages) ? rawMessages.map((msg: any) => this.normalizeMessage(msg)) : [];
        this.otherUser = data?.otherUser || data?.participant || null;
        this.loading = false;
        this.shouldScrollToBottom = true;
        this.markAsRead();
      },
      error: (error: any) => {
        this.logger.error('Error loading conversation:', error);
        this.loading = false;
      }
    });
  }

  normalizeMessage(msg: any): any {
    const sender = msg.sender || msg.senderId;
    const firstName = sender?.profile?.firstName || sender?.firstName || '';
    const lastName = sender?.profile?.lastName || sender?.lastName || '';
    const senderName = `${firstName} ${lastName}`.trim() || sender?.name || sender?.email?.split('@')[0] || 'Unknown';
    
    return {
      ...msg,
      sender: {
        _id: sender?._id || sender?.id,
        id: sender?._id || sender?.id,
        name: senderName,
        avatar: sender?.profile?.avatar || sender?.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(senderName)}`
      }
    };
  }

  setupSocketListeners(): void {
    // Get token from local storage
    const token = localStorage.getItem('token') || '';
    this.socketService.connect(token);
    
    // Listen for private messages
    const privateMsgSub = this.socketService.onMessage().subscribe((message: any) => {
      if (message.conversationId === this.conversationId) {
        this.messages.push(message);
        this.shouldScrollToBottom = true;
        this.markAsRead();
      }
    });
    this.subscriptions.push(privateMsgSub);
    
    // Listen for global messages
    const globalMsgSub = this.socketService.onGlobalMessage().subscribe((message: any) => {
      this.globalMessages.push(message);
      this.shouldScrollGlobalToBottom = true;
    });
    this.subscriptions.push(globalMsgSub);
    
    // Join global chat and load history
    this.socketService.joinGlobalChat();
    this.loadGlobalHistory();
  }

  loadGlobalHistory(): void {
    this.messageService.getGlobalMessages(50).subscribe({
      next: (response: any) => {
        const messages = response?.data?.messages || response?.messages || [];
        this.globalMessages = messages.map((msg: any) => {
          const sender = msg.senderId || msg.sender;
          const firstName = sender?.profile?.firstName || sender?.firstName || '';
          const lastName = sender?.profile?.lastName || sender?.lastName || '';
          const senderName = `${firstName} ${lastName}`.trim() || sender?.name || sender?.email?.split('@')[0] || 'Anonymous';
          
          return {
            _id: msg._id,
            sender: {
              id: sender?._id || sender?.id,
              _id: sender?._id || sender?.id,
              name: senderName,
              avatar: sender?.profile?.avatar || sender?.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(senderName)}`
            },
            content: msg.content,
            timestamp: msg.createdAt || msg.timestamp,
            createdAt: msg.createdAt || msg.timestamp
          };
        });
        this.shouldScrollGlobalToBottom = true;
      },
      error: (error: any) => {
        this.logger.error('Error loading global history:', error);
        this.globalMessages = [];
      }
    });
  }

  sendMessage(): void {
    if (!this.newMessage.trim() || this.sending) return;
    if (!this.otherUser || !this.otherUser._id) {
      this.logger.warn('Cannot send message: No user selected');
      return;
    }

    this.sending = true;
    const receiverId = this.otherUser._id;
    const content = this.newMessage;

    this.messageService.sendMessage(receiverId, content).subscribe({
      next: (response: any) => {
        const newMsg = response?.data?.message || response?.data || response?.message || response;
        if (newMsg) {
          const normalizedMsg = this.normalizeMessage(newMsg);
          this.messages.push(normalizedMsg);
        }
        this.newMessage = '';
        this.shouldScrollToBottom = true;
        this.sending = false;
        
        // Emit socket event
        if (response?.data?.message) {
          this.socketService.sendMessage(response.data.message);
        } else if (response?.data) {
          this.socketService.sendMessage(response.data);
        }
      },
      error: (error: any) => {
        this.logger.error('Error sending message:', error);
        this.sending = false;
      }
    });
  }

  markAsRead(): void {
    this.messageService.markAsRead(this.conversationId).subscribe({
      next: () => {
        this.socketService.decrementUnreadCount();
      },
      error: (error: any) => this.logger.error('Error marking as read:', error)
    });
  }

  // Global chat methods
  sendGlobalMessage(): void {
    if (!this.globalNewMessage.trim() || this.sending) return;

    this.sending = true;
    this.socketService.sendGlobalMessage(this.globalNewMessage);
    this.globalNewMessage = '';
    this.sending = false;
  }

  onTabChange(index: number): void {
    this.selectedTabIndex = index;
    if (index === 1) {
      this.shouldScrollGlobalToBottom = true;
    } else {
      this.shouldScrollToBottom = true;
    }
  }

  scrollToBottom(): void {
    try {
      if (this.messagesContainer) {
        this.messagesContainer.nativeElement.scrollTop = this.messagesContainer.nativeElement.scrollHeight;
      }
    } catch (err) {}
  }

  scrollGlobalToBottom(): void {
    try {
      if (this.globalMessagesContainer) {
        this.globalMessagesContainer.nativeElement.scrollTop = this.globalMessagesContainer.nativeElement.scrollHeight;
      }
    } catch (err) {}
  }

  isOwnMessage(message: any): boolean {
    return message.sender?._id === this.currentUserId || message.sender?.id === this.currentUserId;
  }

  isOwnGlobalMessage(message: any): boolean {
    return message.sender?.id === this.currentUserId;
  }

  // New methods for user management
  loadAllUsers(): void {
    // Fetch all users from the system
    this.userService.getAllUsers(100).subscribe({
      next: (response: any) => {
        // Get all users except the current user
        const users = (response.data || response || [])
          .filter((user: any) => user._id !== this.currentUserId)
          .map((user: any) => {
            // Handle different user data structures
            const firstName = user.profile?.firstName || user.firstName || '';
            const lastName = user.profile?.lastName || user.lastName || '';
            const name = user.name || `${firstName} ${lastName}`.trim() || user.email?.split('@')[0] || 'Unknown User';
            
            // Use user's avatar if available, otherwise generate one using DiceBear API
            let avatar = user.profile?.avatar || user.profilePicture || user.avatar;
            if (!avatar || (typeof avatar === 'string' && avatar.includes('default-avatar'))) {
              // Generate avatar using DiceBear API with the user's name or email as seed
              const seed = encodeURIComponent(name || user.email || user._id);
              avatar = `https://api.dicebear.com/7.x/avataaars/svg?seed=${seed}`;
            }
            
            return {
              _id: user._id,
              name: name,
              email: user.email,
              avatar: avatar,
              unreadCount: 0,
              lastMessageTime: null
            };
          });
        
        this.allUsers = users;
        this.filteredUsers = [...this.allUsers];
        
        // Now get unread counts from conversations
        this.messageService.getConversations().subscribe({
          next: (convResponse: any) => {
            const conversations = convResponse.data?.conversations || convResponse.conversations || [];
            conversations.forEach((conv: any) => {
              const otherUser = conv.participants?.find((p: any) => p._id !== this.currentUserId) || conv.otherUser;
              const userId = otherUser?._id || otherUser?.id;
              
              // Find and update the user with unread count
              const userIndex = this.allUsers.findIndex(u => u._id === userId);
              if (userIndex !== -1) {
                this.allUsers[userIndex].unreadCount = conv.unreadCount || 0;
                this.allUsers[userIndex].lastMessageTime = conv.lastMessage?.createdAt;
              }
            });
            this.filteredUsers = [...this.allUsers];
          }
        });
      },
      error: (error: any) => {
        this.logger.error('Error loading users:', error);
        this.allUsers = [];
        this.filteredUsers = [];
      }
    });
  }

  subscribeToOnlineUsers(): void {
    const sub = this.socketService.onlineUsers$.subscribe(userIds => {
      this.onlineUserIds = userIds;
      this.onlineUsersCount = userIds.length;
    });
    this.subscriptions.push(sub);
  }

  isUserOnline(userId: string): boolean {
    return this.onlineUserIds.includes(userId);
  }

  filterUsers(): void {
    if (!this.searchQuery.trim()) {
      this.filteredUsers = [...this.allUsers];
    } else {
      const query = this.searchQuery.toLowerCase();
      this.filteredUsers = this.allUsers.filter((user: any) => 
        user.name?.toLowerCase().includes(query) ||
        user.email?.toLowerCase().includes(query)
      );
    }
  }

  selectUser(user: any): void {
    this.selectedUserId = user._id;
    this.selectedUser = user;
    
    // Set otherUser for sendMessage
    this.otherUser = {
      _id: user._id,
      name: user.name,
      email: user.email,
      avatar: user.avatar
    };
    
    this.messages = [];
    this.loading = true;
    
    // Generate conversation ID (same logic as backend)
    const ids = [this.currentUserId, user._id].sort();
    this.conversationId = `${ids[0]}_${ids[1]}`;
    
    // Try to load existing conversation
    this.messageService.getConversationMessages(this.conversationId).subscribe({
      next: (response: any) => {
        const raw = response?.data?.messages || response?.data || response?.messages || response;
        this.messages = Array.isArray(raw) ? raw.map((msg: any) => this.normalizeMessage(msg)) : [];
        this.loading = false;
        this.shouldScrollToBottom = true;
        
        // Mark messages as read
        if (this.messages.length > 0) {
          this.messageService.markAsRead(this.conversationId).subscribe();
        }
      },
      error: (error: any) => {
        // Conversation doesn't exist yet, that's fine
        this.logger.info('No existing conversation, starting fresh');
        this.messages = [];
        this.loading = false;
      }
    });
  }

  openGlobalChat(): void {
    this.selectedTabIndex = 1;
  }

  // Helper method to get avatar URL with fallback to DiceBear API
  getAvatarUrl(user: any): string {
    if (user?.avatar && !(typeof user.avatar === 'string' && user.avatar.includes('default-avatar'))) {
      return user.avatar;
    }
    if (user?.profile?.avatar) {
      return user.profile.avatar;
    }
    // Generate avatar using DiceBear API
    const seed = encodeURIComponent(user?.name || user?.email || user?._id || 'user');
    return `https://api.dicebear.com/7.x/avataaars/svg?seed=${seed}`;
  }

  // Get names of online users
  getOnlineUserNames(): string[] {
    return this.allUsers
      .filter(user => this.isUserOnline(user._id))
      .map(user => user.name)
      .filter(name => name && name !== 'Unknown User');
  }
}


