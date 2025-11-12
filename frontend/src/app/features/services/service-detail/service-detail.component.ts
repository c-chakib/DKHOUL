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
import { LoggerService } from '../../../core/services/logger.service';
import { ToastService } from '../../../core/services/toast.service';

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
    private authService: AuthService,
    private logger: LoggerService,
    private toastService: ToastService
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
        // Handle API response structure: { success: true, data: { service } }
        const service = response?.data?.service || response?.service || response?.data || response;
        this.service = service;
        // Normalize images array
        const imgs = this.service?.images || this.service?.photos || [];
        this.service.images = Array.isArray(imgs) ? imgs : [];
        // If there are no images, leave array empty so the template shows a safe placeholder
        if (!this.service.images.length) {
          this.service.images = [];
        }
        this.selectedImage = 0;
        // Compare hostId with currentUserId (handle both string and object IDs)
        const hostId = typeof this.service.hostId === 'object' ? this.service.hostId?._id : this.service.hostId;
        this.isOwner = hostId === this.currentUserId || hostId?.toString() === this.currentUserId;
        this.isHost = this.isOwner; // Set both properties
        this.loading = false;
      },
      error: (error) => {
        this.logger.error('Error loading service', error);
        const errorMessage = error.error?.message || error.error?.error || 'Failed to load service details';
        this.toastService.error(errorMessage, 'Close', 5000);
        this.loading = false;
        setTimeout(() => {
          this.router.navigate(['/services']);
        }, 2000);
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
      this.toastService.info('Please login to book this service', 'Close', 5000);
      setTimeout(() => {
        this.router.navigate(['/auth/login']);
      }, 2000);
      return;
    }

    this.router.navigate(['/bookings/create'], {
      queryParams: { serviceId: this.service._id }
    });
  }

  contactHost(): void {
    if (!this.currentUserId) {
      this.toastService.info('Please login to contact the host', 'Close', 5000);
      setTimeout(() => {
        this.router.navigate(['/auth/login']);
      }, 2000);
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
      }).catch((error) => {
        this.logger.error('Error sharing service', error);
      });
    } else {
      navigator.clipboard.writeText(window.location.href).then(() => {
        this.toastService.success('Service link copied to clipboard', '', 2000);
      }).catch((error) => {
        this.logger.error('Error copying to clipboard', error);
        this.toastService.error('Failed to copy link. Please try again.', 'Close', 3000);
      });
    }
  }

  selectImage(index: number): void {
    if (this.service?.images && index >= 0 && index < this.service.images.length) {
      this.selectedImage = index;
    }
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
