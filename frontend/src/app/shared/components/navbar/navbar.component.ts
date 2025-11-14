
import { Component, OnInit, OnDestroy, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, NavigationEnd, Router, RouterModule } from '@angular/router';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatBadgeModule } from '@angular/material/badge';
import { MatDividerModule } from '@angular/material/divider';
import { Subscription } from 'rxjs';
import { filter } from 'rxjs/operators';
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
  currentUser: import('../../../models/user').User | null = null;
  unreadMessages = 0;
  currentLanguage = 'fr';
  currentLanguageFlag = '🇫🇷';
  isMobileMenuOpen = false;
  isMarketingLayout = false;
  isScrolled = false;
  private subscriptions: Subscription[] = [];

  authService = inject(AuthService);
  router = inject(Router);
  route = inject(ActivatedRoute);
  socketService = inject(SocketService);
  messageService = inject(MessageService);

  ngOnInit(): void {
    // Track scroll for navbar style
    if (typeof window !== 'undefined') {
      window.addEventListener('scroll', this.onScroll, { passive: true });
      // Close mobile menu on escape key
      document.addEventListener('keydown', this.handleKeyDown);
    }

    // Track layout (marketing vs app) via route data
    const routeSub = this.router.events
      .pipe(filter((e) => e instanceof NavigationEnd))
      .subscribe(() => {
        this.isMarketingLayout = this.computeIsMarketingLayout();
        // Close mobile menu on route change
        this.closeMobileMenu();
      });
    this.subscriptions.push(routeSub);

    // Initial compute
    this.isMarketingLayout = this.computeIsMarketingLayout();

    // Subscribe to auth state
    const authSub = this.authService.currentUser.subscribe((user: import('../../../models/user').User | null) => {
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

  private onScroll = (): void => {
    if (typeof window !== 'undefined') {
      this.isScrolled = window.scrollY > 20;
    }
  };

  private handleKeyDown = (event: KeyboardEvent): void => {
    // Close mobile menu on Escape key
    if (event.key === 'Escape' && this.isMobileMenuOpen) {
      this.closeMobileMenu();
    }
  };

  private computeIsMarketingLayout(): boolean {
    let snapshot = this.route.snapshot;
    // Traverse to deepest child to read data
    while (snapshot.firstChild) {
      snapshot = snapshot.firstChild;
    }
    const layout = snapshot.data?.['layout'];
    // Also consider URL path as a fallback
    const url = this.router.url || '';
    return layout === 'marketing' || url === '/' || url.startsWith('/investor');
  }

  ngOnDestroy(): void {
    if (typeof window !== 'undefined') {
      window.removeEventListener('scroll', this.onScroll);
      document.removeEventListener('keydown', this.handleKeyDown);
    }
    // Restore body scroll
    if (typeof document !== 'undefined') {
      document.body.style.overflow = '';
    }
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }

  private loadUnreadCount(): void {
    this.messageService.getConversations().subscribe({
      next: (response: unknown) => {
            // Type assertion fix: response should be { unreadCount: number, conversations?: any[] }
            interface Conversation { unreadCount?: number; }
            let conversations: Conversation[] = [];
            if (typeof response === 'object' && response !== null) {
              if ('unreadCount' in response) {
                this.unreadMessages = (response as { unreadCount: number }).unreadCount ?? 0;
              } else {
                this.unreadMessages = 0;
              }
              if ('conversations' in response && Array.isArray((response as { conversations?: Conversation[] }).conversations)) {
                  conversations = (response as { conversations: Conversation[] }).conversations;
              } else if ('data' in response && Array.isArray((response as { data?: { conversations?: Conversation[] } }).data?.conversations)) {
                  conversations = (response as { data: { conversations: Conversation[] } }).data.conversations;
              }
            } else {
              this.unreadMessages = 0;
            }
            const totalUnread = Array.isArray(conversations)
              ? conversations.reduce((sum: number, conv: { unreadCount?: number }) => sum + (conv?.unreadCount || 0), 0)
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
    // Update flag emoji
    switch(lang) {
      case 'fr':
        this.currentLanguageFlag = '🇫🇷';
        break;
      case 'ar':
        this.currentLanguageFlag = '🇲🇦';
        break;
      case 'en':
        this.currentLanguageFlag = '🇬🇧';
        break;
    }
    // TODO: Implement actual language change logic with i18n
  // Removed debug log
  }

  toggleMobileMenu(): void {
    this.isMobileMenuOpen = !this.isMobileMenuOpen;
    this.updateBodyScroll();
  }

  closeMobileMenu(): void {
    this.isMobileMenuOpen = false;
    this.updateBodyScroll();
  }

  private updateBodyScroll(): void {
    // Prevent body scroll when menu is open
    if (typeof document !== 'undefined') {
      document.body.style.overflow = this.isMobileMenuOpen ? 'hidden' : '';
    }
  }

  navigateToLanding(): void {
    // Logo ALWAYS goes to landing page
    this.router.navigate(['/']);
  }

  navigateToHome(): void {
    // This is the "Accueil" button in marketplace - goes to /home
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
    this.router.navigate(['/']);
  }

  isProvider(): boolean {
  // Backend uses 'host' role, but frontend may receive 'provider' from registration
  // Support both for compatibility
  return this.currentUser?.role === 'provider' || this.currentUser?.role === 'host';
  }

  isAdmin(): boolean {
  return this.currentUser?.role === 'admin';
  }

  getInitials(): string {
  if (!this.currentUser) return '?';
  const first = this.currentUser?.profile?.firstName?.charAt(0) || '';
  const last = this.currentUser?.profile?.lastName?.charAt(0) || '';
  return (first + last).toUpperCase() || '?';
  }

  getUserRole(): string {
  if (this.isAdmin()) return 'Administrateur';
  if (this.isProvider()) return 'Host';
  return 'Voyageur';
  }
}
