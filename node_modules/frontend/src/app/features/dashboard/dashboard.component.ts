import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { AuthService } from '../../core/services/auth.service';
import { BookingService } from '../../core/services/booking.service';
import { ServiceService } from '../../core/services/service.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule, MatCardModule, MatButtonModule, MatIconModule, MatProgressSpinnerModule],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  user: any = null;
  loading = true;
  stats = {
    totalBookings: 0,
    upcomingBookings: 0,
    totalEarnings: 0,
    activeServices: 0,
    averageRating: 0,
    totalReviews: 0
  };
  recentBookings: any[] = [];
  recentServices: any[] = [];

  constructor(
    private authService: AuthService,
    private bookingService: BookingService,
    private serviceService: ServiceService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.user = this.authService.getCurrentUser();
    this.loadDashboardData();
  }

  loadDashboardData(): void {
    // Load bookings stats
    this.bookingService.getMyBookings().subscribe({
      next: (bookings) => {
        this.stats.totalBookings = bookings.length;
        const now = new Date();
        this.stats.upcomingBookings = bookings.filter((b: any) => 
          new Date(b.startDate) >= now && b.status !== 'cancelled'
        ).length;
        this.recentBookings = bookings.slice(0, 5);
        this.loading = false;
      },
      error: (error: any) => console.error('Error loading bookings:', error)
    });

    // If host, load services stats
    if (this.user?.role === 'host' || this.user?.role === 'both') {
      this.serviceService.getMyServices().subscribe({
        next: (services) => {
          this.stats.activeServices = services.filter((s: any) => s.status === 'active').length;
          this.stats.totalEarnings = services.reduce((sum: number, s: any) => sum + (s.totalEarnings || 0), 0);
          const ratings = services.map((s: any) => s.rating).filter((r: any) => r);
          this.stats.averageRating = ratings.length > 0 ? ratings.reduce((a: number, b: number) => a + b, 0) / ratings.length : 0;
          this.stats.totalReviews = services.reduce((sum: number, s: any) => sum + (s.reviews?.length || 0), 0);
          this.recentServices = services.slice(0, 5);
        },
        error: (error: any) => console.error('Error loading services:', error)
      });
    }
  }

  navigateTo(route: string): void {
    this.router.navigate([route]);
  }
}
