import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatBadgeModule } from '@angular/material/badge';
import { MatDividerModule } from '@angular/material/divider';
import { Subscription } from 'rxjs';
import { AuthService } from '../../../core/services/auth.service';
import { SocketService } from '../../../core/services/socket.service';
import { MessageService } from '../../../core/services/message.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatToolbarModule,
    MatButtonModule,
    MatIconModule,
    MatMenuModule,
    MatBadgeModule,
    MatDividerModule
  ],
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit, OnDestroy {
  isLoggedIn = false;
  currentUser: any = null;
  unreadMessages = 0;
  currentLanguage = 'fr'; // Default language
  isMobileMenuOpen = false;
  private subscriptions: Subscription[] = [];

  constructor(
    private authService: AuthService,
    private router: Router,
    private socketService: SocketService,
    private messageService: MessageService
  ) {}

  ngOnInit(): void {
    // Subscribe to auth state
    const authSub = this.authService.currentUser.subscribe((user: any) => {
      this.isLoggedIn = !!user;
      this.currentUser = user;
      
      if (user) {
        // Connect socket when user logs in
        const token = localStorage.getItem('token');
        if (token) {
          this.socketService.connect(token);
        }
        
        // Load initial unread count
        this.loadUnreadCount();
      }
    });
    this.subscriptions.push(authSub);

    // Subscribe to real-time unread count updates
    const unreadSub = this.socketService.unreadCount$.subscribe(count => {
      this.unreadMessages = count;
    });
    this.subscriptions.push(unreadSub);
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }

  private loadUnreadCount(): void {
    this.messageService.getConversations().subscribe({
      next: (response: any) => {
        const conversations = response?.data?.conversations || response?.conversations || response?.data || response || [];
        const totalUnread = Array.isArray(conversations)
          ? conversations.reduce((sum: number, conv: any) => sum + (conv?.unreadCount || 0), 0)
          : 0;
        this.socketService.setUnreadCount(totalUnread);
      },
      error: (error) => {
        console.error('Error loading unread count:', error);
      }
    });
  }

  changeLanguage(lang: string): void {
    this.currentLanguage = lang;
    // TODO: Implement actual language change logic with i18n
    console.log('Language changed to:', lang);
  }

  toggleMobileMenu(): void {
    this.isMobileMenuOpen = !this.isMobileMenuOpen;
    // TODO: Implement mobile menu functionality
    console.log('Mobile menu toggled:', this.isMobileMenuOpen);
  }

  navigateToHome(): void {
    this.router.navigate(['/home']);
  }

  navigateToServices(): void {
    this.router.navigate(['/services']);
  }

  navigateToDashboard(): void {
    this.router.navigate(['/dashboard']);
  }

  navigateToBookings(): void {
    this.router.navigate(['/bookings']);
  }

  navigateToMessages(): void {
    this.router.navigate(['/messages']);
  }

  navigateToProfile(): void {
    this.router.navigate(['/profile']);
  }

  navigateToLogin(): void {
    this.router.navigate(['/auth/login']);
  }

  navigateToRegister(): void {
    this.router.navigate(['/auth/register']);
  }

  navigateToAdmin(): void {
    this.router.navigate(['/admin']);
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/home']);
  }

  isProvider(): boolean {
    return this.currentUser?.role === 'provider';
  }

  isAdmin(): boolean {
    return this.currentUser?.role === 'admin';
  }
}
