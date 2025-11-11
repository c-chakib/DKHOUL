import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { ReviewService } from '../../../core/services/review.service';

@Component({
  selector: 'app-review-list',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatIconModule, MatButtonModule, MatPaginatorModule, MatProgressSpinnerModule],
  templateUrl: './review-list.component.html',
  styleUrl: './review-list.component.scss'
})
export class ReviewListComponent implements OnInit {
  @Input() serviceId: string = '';
  
  reviews: any[] = [];
  loading = true;
  totalReviews = 0;
  pageSize = 10;
  pageIndex = 0;
  averageRating = 0;
  ratingDistribution = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };

  constructor(private reviewService: ReviewService) {}

  ngOnInit(): void {
    this.loadReviews();
  }

  loadReviews(): void {
    this.reviewService.getServiceReviews(this.serviceId).subscribe({
      next: (response: any) => {
        this.reviews = response.data || [];
        this.totalReviews = this.reviews.length;
        this.calculateRatingStats();
        this.loading = false;
      },
      error: (error: any) => {
        this.logger.error('Error loading reviews:', error);
        this.loading = false;
      }
    });
  }

  calculateRatingStats(): void {
    if (this.reviews.length === 0) {
      this.averageRating = 0;
      return;
    }
    
    const sum = this.reviews.reduce((acc, review) => acc + (review.ratings?.overall || 0), 0);
    this.averageRating = sum / this.reviews.length;
    
    this.ratingDistribution = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
    this.reviews.forEach(review => {
      const rating = Math.round(review.ratings?.overall || 0);
      if (rating >= 1 && rating <= 5) {
        this.ratingDistribution[rating as keyof typeof this.ratingDistribution]++;
      }
    });
  }

  onPageChange(event: PageEvent): void {
    this.pageIndex = event.pageIndex;
    this.pageSize = event.pageSize;
    this.loadReviews();
  }

  getRatingStars(rating: number): number[] {
    return Array(Math.round(rating)).fill(0);
  }

  getRatingPercentage(stars: number): number {
    return this.totalReviews > 0 ? (this.ratingDistribution[stars as keyof typeof this.ratingDistribution] / this.totalReviews) * 100 : 0;
  }
}


