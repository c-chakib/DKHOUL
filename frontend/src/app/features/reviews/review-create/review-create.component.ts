import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSliderModule } from '@angular/material/slider';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { ReviewService } from '../../../core/services/review.service';
import { BookingService } from '../../../core/services/booking.service';
import Swal from 'sweetalert2';
import { LoggerService } from '../../../core/services/logger.service';

@Component({
  selector: 'app-review-create',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, MatCardModule, MatButtonModule, MatIconModule, 
            MatFormFieldModule, MatInputModule, MatSliderModule, MatProgressSpinnerModule],
  templateUrl: './review-create.component.html',
  styleUrl: './review-create.component.scss'
})
export class ReviewCreateComponent implements OnInit {
  reviewForm!: FormGroup;
  booking: any = null;
  loading = true;
  submitting = false;

  ratingCategories = [
    { key: 'cleanliness', label: 'Cleanliness', icon: 'cleaning_services' },
    { key: 'communication', label: 'Communication', icon: 'chat' },
    { key: 'accuracy', label: 'Accuracy', icon: 'check_circle' },
    { key: 'location', label: 'Location', icon: 'location_on' },
    { key: 'value', label: 'Value', icon: 'attach_money' }
  ];

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private reviewService: ReviewService,
    private bookingService: BookingService,
    private logger: LoggerService
  ) {}

  ngOnInit(): void {
    this.initForm();
    const bookingId = this.route.snapshot.queryParamMap.get('bookingId');
    if (bookingId) {
      this.loadBooking(bookingId);
    }
  }

  initForm(): void {
    this.reviewForm = this.fb.group({
      rating: [5, [Validators.required, Validators.min(1), Validators.max(5)]],
      cleanliness: [5, [Validators.required, Validators.min(1), Validators.max(5)]],
      communication: [5, [Validators.required, Validators.min(1), Validators.max(5)]],
      accuracy: [5, [Validators.required, Validators.min(1), Validators.max(5)]],
      location: [5, [Validators.required, Validators.min(1), Validators.max(5)]],
      value: [5, [Validators.required, Validators.min(1), Validators.max(5)]],
      comment: ['', [Validators.required, Validators.minLength(20), Validators.maxLength(500)]]
    });
  }

  loadBooking(bookingId: string): void {
    this.bookingService.getBookingById(bookingId).subscribe({
      next: (booking: any) => {
        this.booking = booking;
        this.loading = false;
      },
      error: (error: any) => {
        this.logger.error('Error loading booking:', error);
        Swal.fire('Error', 'Failed to load booking details', 'error');
        this.loading = false;
      }
    });
  }

  onSubmit(): void {
    if (this.reviewForm.invalid || !this.booking) return;

    this.submitting = true;
    const reviewData = {
      ...this.reviewForm.value,
      service: this.booking.service._id,
      booking: this.booking._id
    };

    this.reviewService.createReview(reviewData).subscribe({
      next: () => {
        Swal.fire('Success!', 'Your review has been submitted', 'success');
        this.router.navigate(['/bookings', this.booking._id]);
      },
      error: (error: any) => {
        this.logger.error('Error submitting review:', error);
        Swal.fire('Error', 'Failed to submit review', 'error');
        this.submitting = false;
      }
    });
  }

  getRatingStars(value: number): number[] {
    return Array(Math.round(value)).fill(0);
  }

  cancel(): void {
    this.router.navigate(['/bookings']);
  }
}


