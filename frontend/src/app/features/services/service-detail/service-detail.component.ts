import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { MatTabsModule } from '@angular/material/tabs';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatDividerModule } from '@angular/material/divider';
import { ServiceService } from '../../../core/services/service.service';
import { AuthService } from '../../../core/services/auth.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-service-detail',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatChipsModule,
    MatTabsModule,
    MatProgressSpinnerModule,
    MatDividerModule
  ],
  templateUrl: './service-detail.component.html',
  styleUrl: './service-detail.component.scss'
})
export class ServiceDetailComponent implements OnInit {
  service: any = null;
  loading = true;
  selectedPhotoIndex = 0;
  selectedImage = 0; // For image gallery
  isOwner = false;
  isHost = false; // Alias for isOwner
  currentUserId: string | null = null;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private serviceService: ServiceService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    const serviceId = this.route.snapshot.params['id'];
    // Get current user ID from auth service
    this.authService.currentUser.subscribe(user => {
      this.currentUserId = user?._id || null;
    });
    this.loadService(serviceId);
  }

  loadService(serviceId: string): void {
    this.loading = true;

    this.serviceService.getServiceById(serviceId).subscribe({
      next: (response: any) => {
        this.service = response.service || response;
        this.isOwner = this.service.hostId === this.currentUserId;
        this.isHost = this.isOwner; // Set both properties
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading service:', error);
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'Failed to load service details',
          confirmButtonColor: '#667eea'
        });
        this.loading = false;
        this.router.navigate(['/services']);
      }
    });
  }

  selectPhoto(index: number): void {
    this.selectedPhotoIndex = index;
  }

  previousPhoto(): void {
    if (this.selectedPhotoIndex > 0) {
      this.selectedPhotoIndex--;
    }
  }

  nextPhoto(): void {
    if (this.selectedPhotoIndex < this.service.photos.length - 1) {
      this.selectedPhotoIndex++;
    }
  }

  bookService(): void {
    if (!this.currentUserId) {
      Swal.fire({
        icon: 'info',
        title: 'Login Required',
        text: 'Please login to book this service',
        confirmButtonText: 'Go to Login',
        confirmButtonColor: '#667eea'
      }).then((result) => {
        if (result.isConfirmed) {
          this.router.navigate(['/auth/login']);
        }
      });
      return;
    }

    this.router.navigate(['/bookings/create'], {
      queryParams: { serviceId: this.service._id }
    });
  }

  contactHost(): void {
    if (!this.currentUserId) {
      Swal.fire({
        icon: 'info',
        title: 'Login Required',
        text: 'Please login to contact the host',
        confirmButtonColor: '#667eea'
      });
      return;
    }

    this.router.navigate(['/messages'], {
      queryParams: { userId: this.service.hostId }
    });
  }

  editService(): void {
    this.router.navigate(['/services/edit', this.service._id]);
  }

  getRatingStars(rating: number): string[] {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;

    for (let i = 0; i < fullStars; i++) {
      stars.push('star');
    }
    if (hasHalfStar) {
      stars.push('star_half');
    }
    while (stars.length < 5) {
      stars.push('star_border');
    }

    return stars;
  }

  getCategoryIcon(category: string): string {
    switch (category) {
      case 'Space': return 'home';
      case 'Skills': return 'school';
      case 'Connect': return 'explore';
      default: return 'category';
    }
  }

  shareService(): void {
    if (navigator.share) {
      navigator.share({
        title: this.service.title,
        text: this.service.description,
        url: window.location.href
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      Swal.fire({
        icon: 'success',
        title: 'Link Copied!',
        text: 'Service link copied to clipboard',
        timer: 2000,
        showConfirmButton: false
      });
    }
  }

  selectImage(index: number): void {
    this.selectedImage = index;
  }

  reviewStats(): any[] {
    if (!this.service || !this.service.reviews || this.service.reviews.length === 0) {
      return [];
    }
    
    const ratings = [5, 4, 3, 2, 1];
    const total = this.service.reviews.length;
    
    return ratings.map(rating => {
      const count = this.service.reviews.filter((r: any) => Math.round(r.rating) === rating).length;
      const percentage = (count / total) * 100;
      return { rating, count, percentage };
    });
  }
}
