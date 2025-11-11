import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { MatBadgeModule } from '@angular/material/badge';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatButtonModule } from '@angular/material/button';
import { MatTabsModule } from '@angular/material/tabs';
import { MatChipsModule } from '@angular/material/chips';
import { MessageService } from '../../../core/services/message.service';
import { UserService } from '../../../core/services/user.service';
import { SocketService } from '../../../core/services/socket.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-conversations-list',
  standalone: true,
  imports: [
    CommonModule, 
    FormsModule, 
    RouterModule, 
    MatListModule, 
    MatIconModule, 
    MatBadgeModule, 
    MatFormFieldModule, 
    MatInputModule, 
    MatProgressSpinnerModule,
    MatButtonModule,
    MatTabsModule,
    MatChipsModule
  ],
  templateUrl: './conversations-list.component.html',
  styleUrl: './conversations-list.component.scss'
})
export class ConversationsListComponent implements OnInit, OnDestroy {
  conversations: any[] = [];
  filteredConversations: any[] = [];
  allUsers: any[] = [];
  filteredUsers: any[] = [];
  onlineUserIds: string[] = [];
  loading = true;
  searchQuery = '';
  selectedTab = 0;
  private subscriptions: Subscription[] = [];

  constructor(
    private messageService: MessageService,
    private userService: UserService,
    private socketService: SocketService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadConversations();
    this.loadUsers();
    this.subscribeToOnlineUsers();
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }

  loadConversations(): void {
    this.messageService.getConversations().subscribe({
      next: (response: any) => {
        // Ensure conversations is always an array
        const conversationsData = response.conversations || response;
        this.conversations = Array.isArray(conversationsData) ? conversationsData : [];
        this.filteredConversations = this.conversations;
        this.loading = false;
      },
      error: (error: any) => {
        this.logger.error('Error loading conversations:', error);
        this.conversations = [];
        this.filteredConversations = [];
        this.loading = false;
      }
    });
  }

  loadUsers(): void {
    this.userService.getAllUsers(100).subscribe({
      next: (response: any) => {
        this.allUsers = response.data || [];
        this.filteredUsers = this.allUsers;
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
    });
    this.subscriptions.push(sub);
  }

  searchConversations(query: string): void {
    this.searchQuery = query;
    if (this.selectedTab === 0) {
      // Search conversations
      if (!query) {
        this.filteredConversations = this.conversations;
      } else {
        this.filteredConversations = this.conversations.filter((conv: any) =>
          conv.otherUser.name.toLowerCase().includes(query.toLowerCase())
        );
      }
    } else {
      // Search users
      if (!query) {
        this.filteredUsers = this.allUsers;
      } else {
        this.filteredUsers = this.allUsers.filter((user: any) =>
          user.name.toLowerCase().includes(query.toLowerCase()) ||
          user.email.toLowerCase().includes(query.toLowerCase())
        );
      }
    }
  }

  onTabChange(index: number): void {
    this.selectedTab = index;
    this.searchQuery = '';
    if (index === 0) {
      this.filteredConversations = this.conversations;
    } else {
      this.filteredUsers = this.allUsers;
    }
  }

  selectConversation(conversationId: string): void {
    this.router.navigate(['/messages', conversationId]);
  }

  startChatWithUser(userId: string): void {
    // Create a new conversation or navigate to existing one
    this.messageService.createConversation(userId).subscribe({
      next: (response: any) => {
        const conversationId = response.data?._id || response._id;
        this.router.navigate(['/messages', conversationId]);
      },
      error: (error: any) => {
        this.logger.error('Error creating conversation:', error);
      }
    });
  }

  isUserOnline(userId: string): boolean {
    return this.onlineUserIds.includes(userId);
  }

  getLastMessagePreview(message: string): string {
    return message.length > 50 ? message.substring(0, 50) + '...' : message;
  }
}


