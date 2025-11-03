import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { MatDividerModule } from '@angular/material/divider';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { BookingService } from '../../../core/services/booking.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-booking-detail',
  standalone: true,
  imports: [CommonModule, RouterModule, MatCardModule, MatButtonModule, MatIconModule, MatChipsModule, MatDividerModule, MatProgressSpinnerModule],
  templateUrl: './booking-detail.component.html',
  styleUrl: './booking-detail.component.scss'
})
export class BookingDetailComponent implements OnInit {
  booking: any = null;
  loading = true;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private bookingService: BookingService
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.params['id'];
    this.loadBooking(id);
  }

  loadBooking(id: string): void {
    this.bookingService.getBookingById(id).subscribe({
      next: (booking) => {
        this.booking = booking;
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading booking:', error);
        Swal.fire('Error', 'Failed to load booking', 'error');
        this.router.navigate(['/bookings']);
      }
    });
  }

  cancelBooking(): void {
    Swal.fire({
      title: 'Cancel Booking?',
      input: 'textarea',
      inputLabel: 'Reason for cancellation',
      inputPlaceholder: 'Please provide a reason...',
      text: 'This action cannot be undone',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, cancel it',
      inputValidator: (value) => {
        if (!value) {
          return 'You need to provide a reason!';
        }
        return null;
      }
    }).then((result) => {
      if (result.isConfirmed && result.value) {
        this.bookingService.cancelBooking(this.booking._id, result.value).subscribe({
          next: () => {
            Swal.fire('Cancelled!', 'Booking has been cancelled', 'success');
            this.loadBooking(this.booking._id);
          },
          error: (error: any) => {
            Swal.fire('Error', 'Failed to cancel booking', 'error');
          }
        });
      }
    });
  }

  contactHost(): void {
    this.router.navigate(['/messages'], { queryParams: { userId: this.booking.service.hostId } });
  }

  leaveReview(): void {
    this.router.navigate(['/reviews/create'], { queryParams: { bookingId: this.booking._id } });
  }
}
