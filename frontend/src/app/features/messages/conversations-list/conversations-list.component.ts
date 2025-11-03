import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { MatBadgeModule } from '@angular/material/badge';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MessageService } from '../../../core/services/message.service';

@Component({
  selector: 'app-conversations-list',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, MatListModule, MatIconModule, MatBadgeModule, MatFormFieldModule, MatInputModule, MatProgressSpinnerModule],
  templateUrl: './conversations-list.component.html',
  styleUrl: './conversations-list.component.scss'
})
export class ConversationsListComponent implements OnInit {
  conversations: any[] = [];
  filteredConversations: any[] = [];
  loading = true;
  searchQuery = '';

  constructor(
    private messageService: MessageService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadConversations();
  }

  loadConversations(): void {
    this.messageService.getConversations().subscribe({
      next: (conversations: any) => {
        this.conversations = conversations;
        this.filteredConversations = conversations;
        this.loading = false;
      },
      error: (error: any) => {
        console.error('Error loading conversations:', error);
        this.loading = false;
      }
    });
  }

  searchConversations(query: string): void {
    this.searchQuery = query;
    if (!query) {
      this.filteredConversations = this.conversations;
    } else {
      this.filteredConversations = this.conversations.filter((conv: any) =>
        conv.otherUser.name.toLowerCase().includes(query.toLowerCase())
      );
    }
  }

  selectConversation(conversationId: string): void {
    this.router.navigate(['/messages', conversationId]);
  }

  getLastMessagePreview(message: string): string {
    return message.length > 50 ? message.substring(0, 50) + '...' : message;
  }
}
