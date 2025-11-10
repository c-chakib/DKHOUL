import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTabsModule } from '@angular/material/tabs';
import { MatChipsModule } from '@angular/material/chips';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { BookingService } from '../../../core/services/booking.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-booking-list',
  standalone: true,
  imports: [CommonModule, RouterModule, MatCardModule, MatButtonModule, MatIconModule, MatTabsModule, MatChipsModule, MatProgressSpinnerModule],
  templateUrl: './booking-list.component.html',
  styleUrl: './booking-list.component.scss'
})
export class BookingListComponent implements OnInit {
  upcomingBookings: any[] = [];
  pastBookings: any[] = [];
  cancelledBookings: any[] = [];
  loading = true;

  constructor(
    private bookingService: BookingService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadBookings();
  }

  loadBookings(): void {
    this.bookingService.getMyBookings().subscribe({
      next: (response) => {
        // Accept multiple possible API shapes: { success, data: { bookings } }, { bookings }, array
        let bookings: any[] = [];
        if (Array.isArray(response)) {
          bookings = response;
        } else if (Array.isArray(response?.data)) {
          bookings = response.data;
        } else if (Array.isArray(response?.data?.bookings)) {
          bookings = response.data.bookings;
        } else if (Array.isArray(response?.bookings)) {
          bookings = response.bookings;
        } else {
          // Fallback: gather any enumerable values that look like booking objects
          bookings = Object.values(response).filter((v: any) => v && typeof v === 'object' && 'status' in v);
        }

        const now = new Date();
        this.upcomingBookings = bookings.filter((b: any) => {
          const bookingDate = new Date(b.date || b.bookingDate || b.createdAt);
          return (b.status === 'confirmed' || b.status === 'pending') && bookingDate >= now;
        });
        this.pastBookings = bookings.filter((b: any) => {
          const bookingDate = new Date(b.date || b.bookingDate || b.createdAt);
          return b.status === 'completed' || (bookingDate < now && b.status !== 'cancelled');
        });
        this.cancelledBookings = bookings.filter((b: any) => b.status === 'cancelled');
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading bookings:', error);
        this.loading = false;
      }
    });
  }

  filterBookings(tabIndex: number): void {
    // Tabs are already filtered, this can trigger analytics or other actions
  }

  viewBooking(id: string): void {
    this.router.navigate(['/bookings', id]);
  }

  cancelBooking(id: string): void {
    Swal.fire({
      title: 'Cancel Booking?',
      input: 'textarea',
      inputLabel: 'Reason for cancellation',
      inputPlaceholder: 'Please provide a reason for cancellation...',
      text: 'You will receive a full refund.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Yes, cancel it',
      inputValidator: (value) => {
        if (!value) {
          return 'You need to provide a reason!';
        }
        return null;
      }
    }).then((result) => {
      if (result.isConfirmed && result.value) {
        this.bookingService.cancelBooking(id, result.value).subscribe({
          next: () => {
            Swal.fire('Cancelled!', 'Your booking has been cancelled.', 'success');
            this.loadBookings();
          },
          error: (error: any) => {
            console.error('Error cancelling booking:', error);
            Swal.fire('Error', 'Failed to cancel booking. Please try again.', 'error');
          }
        });
      }
    });
  }

  leaveReview(bookingId: string): void {
    this.router.navigate(['/reviews/create'], { queryParams: { bookingId } });
  }
}
