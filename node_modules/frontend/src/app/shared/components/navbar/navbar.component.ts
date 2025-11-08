import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatBadgeModule } from '@angular/material/badge';
import { MatDividerModule } from '@angular/material/divider';
import { AuthService } from '../../../core/services/auth.service';

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
export class NavbarComponent implements OnInit {
  isLoggedIn = false;
  currentUser: any = null;
  unreadMessages = 3; // This should come from a service
  currentLanguage = 'fr'; // Default language
  isMobileMenuOpen = false;

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    // Subscribe to auth state
    this.authService.currentUser.subscribe((user: any) => {
      this.isLoggedIn = !!user;
      this.currentUser = user;
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
