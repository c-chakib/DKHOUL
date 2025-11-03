import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { MatTabsModule } from '@angular/material/tabs';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { UserService } from '../../../core/services/user.service';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-profile-view',
  standalone: true,
  imports: [CommonModule, RouterModule, MatCardModule, MatButtonModule, MatIconModule, MatChipsModule, MatTabsModule, MatProgressSpinnerModule],
  templateUrl: './profile-view.component.html',
  styleUrl: './profile-view.component.scss'
})
export class ProfileViewComponent implements OnInit {
  user: any = null;
  currentUser: any = null;
  loading = true;
  isOwnProfile = false;
  services: any[] = [];
  reviews: any[] = [];
  stats = {
    totalServices: 0,
    totalBookings: 0,
    totalReviews: 0,
    averageRating: 0,
    responseRate: 0,
    responseTime: ''
  };

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private userService: UserService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    // Get current user from auth service
    this.authService.currentUser.subscribe((user: any) => {
      this.currentUser = user;
    });
    
    const userId = this.route.snapshot.paramMap.get('id');
    
    if (userId) {
      this.loadUserProfile(userId);
    } else {
      this.isOwnProfile = true;
      this.loadOwnProfile();
    }
  }

  loadUserProfile(userId: string): void {
    this.userService.getUserProfile(userId).subscribe({
      next: (response: any) => {
        this.user = response.data || response;
        this.isOwnProfile = this.currentUser?._id === userId;
        this.loadUserStats();
        this.loading = false;
      },
      error: (error: any) => {
        console.error('Error loading profile:', error);
        this.loading = false;
      }
    });
  }

  loadOwnProfile(): void {
    this.userService.getUserProfile().subscribe({
      next: (response: any) => {
        this.user = response.data || response;
        this.loadUserStats();
        this.loading = false;
      },
      error: (error: any) => {
        console.error('Error loading profile:', error);
        this.loading = false;
      }
    });
  }

  loadUserStats(): void {
    // Load user statistics (services, bookings, reviews)
    this.stats = {
      totalServices: this.user.totalServices || 0,
      totalBookings: this.user.totalBookings || 0,
      totalReviews: this.user.reviews?.length || 0,
      averageRating: this.user.rating || 0,
      responseRate: this.user.responseRate || 0,
      responseTime: this.user.responseTime || 'N/A'
    };
  }

  editProfile(): void {
    this.router.navigate(['/profile/edit']);
  }

  sendMessage(): void {
    this.router.navigate(['/messages'], { queryParams: { userId: this.user._id } });
  }
}
