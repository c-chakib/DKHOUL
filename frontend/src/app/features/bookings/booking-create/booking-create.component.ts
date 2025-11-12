import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatStepperModule } from '@angular/material/stepper';
import { MatDividerModule } from '@angular/material/divider';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { ServiceService } from '../../../core/services/service.service';
import { BookingService } from '../../../core/services/booking.service';
import { PaymentService } from '../../../core/services/payment.service';
import { LoggerService } from '../../../core/services/logger.service';
import { ToastService } from '../../../core/services/toast.service';

@Component({
  selector: 'app-booking-create',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatStepperModule,
    MatDividerModule,
    MatProgressSpinnerModule
  ],
  templateUrl: './booking-create.component.html',
  styleUrl: './booking-create.component.scss'
})
export class BookingCreateComponent implements OnInit {
  service: any = null;
  bookingForm!: FormGroup;
  loading = true;
  processing = false;
  
  minDate = new Date();
  selectedDate: Date | null = null;
  numberOfGuests = 1;
  duration = 1;
  
  // Price calculation
  basePrice = 0;
  serviceFee = 0;
  totalPrice = 0;

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private serviceService: ServiceService,
    private bookingService: BookingService,
    private paymentService: PaymentService,
    private logger: LoggerService,
    private toastService: ToastService
  ) {}

  ngOnInit(): void {
    const serviceId = this.route.snapshot.queryParams['serviceId'];
    if (!serviceId) {
      this.toastService.error('Service not found', 'Close', 5000);
      setTimeout(() => {
        this.router.navigate(['/services']);
      }, 2000);
      return;
    }

    this.initializeForm();
    this.loadService(serviceId);
  }

  initializeForm(): void {
    this.bookingForm = this.fb.group({
      date: ['', Validators.required],
      startTime: ['', Validators.required],
      guests: [1, [Validators.required, Validators.min(1)]],
      duration: [1, [Validators.required, Validators.min(1)]],
      specialRequests: [''],
      agreedToTerms: [false, Validators.requiredTrue]
    });

    // Listen to form changes to update price
    this.bookingForm.valueChanges.subscribe(() => {
      this.calculatePrice();
    });
  }

  loadService(serviceId: string): void {
    this.serviceService.getServiceById(serviceId).subscribe({
      next: (response) => {
        // Handle API response structure: { success: true, data: { service } }
        const service = response.data?.service || response.service || response;
        this.service = service;
        this.basePrice = service.pricing?.amount || 0;
        
        // Set default duration and guests from service
        if (service.duration) {
          this.bookingForm.patchValue({ duration: service.duration / 60 }); // Convert minutes to hours
        }
        
        this.calculatePrice();
        this.loading = false;
      },
      error: (error) => {
        this.logger.error('Error loading service', error);
        const errorMessage = error.error?.message || error.error?.error || 'Failed to load service';
        this.toastService.error(errorMessage, 'Close', 5000);
        setTimeout(() => {
          this.router.navigate(['/services']);
        }, 2000);
      }
    });
  }

  calculatePrice(): void {
    if (!this.service) return;

    const formValues = this.bookingForm.value;
    const guests = formValues.guests || 1;
    const duration = formValues.duration || 1;
    
    // Calculate base price based on pricing type
    if (this.service.pricing.type === 'per_hour') {
      this.basePrice = this.service.pricing.amount * duration;
    } else if (this.service.pricing.type === 'per_day') {
      this.basePrice = this.service.pricing.amount * Math.ceil(duration / 24);
    } else {
      this.basePrice = this.service.pricing.amount;
    }

    // Service fee (10% of base price)
    this.serviceFee = this.basePrice * 0.1;
    
    // Total price
    this.totalPrice = this.basePrice + this.serviceFee;
  }

  onDateSelected(date: Date): void {
    this.selectedDate = date;
    this.bookingForm.patchValue({ date });
  }

  incrementGuests(): void {
    const current = this.bookingForm.get('guests')?.value || 1;
    const maxGuests = this.service?.maxGuests || 10;
    if (current < maxGuests) {
      this.bookingForm.patchValue({ guests: current + 1 });
    }
  }

  decrementGuests(): void {
    const current = this.bookingForm.get('guests')?.value || 1;
    if (current > 1) {
      this.bookingForm.patchValue({ guests: current - 1 });
    }
  }

  incrementDuration(): void {
    const current = this.bookingForm.get('duration')?.value || 1;
    this.bookingForm.patchValue({ duration: current + 1 });
  }

  decrementDuration(): void {
    const current = this.bookingForm.get('duration')?.value || 1;
    if (current > 1) {
      this.bookingForm.patchValue({ duration: current - 1 });
    }
  }

  async onSubmit(): Promise<void> {
    if (this.bookingForm.invalid) {
      this.toastService.error('Please fill all required fields', 'Close', 5000);
      // Mark all fields as touched to show validation errors
      Object.keys(this.bookingForm.controls).forEach(key => {
        this.bookingForm.get(key)?.markAsTouched();
      });
      return;
    }

    this.processing = true;

    try {
      // Create booking data
      const bookingData = {
        serviceId: this.service._id,
        date: this.bookingForm.value.date,
        startTime: this.bookingForm.value.startTime,
        guests: this.bookingForm.value.guests,
        duration: this.bookingForm.value.duration * 60, // Convert hours to minutes
        totalPrice: this.totalPrice,
        specialRequests: this.bookingForm.value.specialRequests,
        status: 'pending' as const
      };

      // Create booking
      this.bookingService.createBooking(bookingData).subscribe({
        next: async (response) => {
          // Handle API response structure: { success: true, data: { booking } }
          const booking = response.data?.booking || response.booking || response;
          const bookingId = booking._id || booking.id;
          
          if (!bookingId) {
            this.logger.error('Booking ID not found in response', response);
            this.toastService.error('Booking created but ID not found. Please check your bookings.', 'Close', 5000);
            this.processing = false;
            return;
          }

          // Process payment
          try {
            const paymentResult = await this.paymentService.processPayment({
              bookingId: bookingId,
              amount: this.totalPrice,
              currency: 'MAD'
            }).toPromise();

            if (paymentResult?.success || paymentResult?.data?.success) {
              this.processing = false;
              this.toastService.success('Booking confirmed! Payment processed.', '', 5000);
              setTimeout(() => {
                this.router.navigate(['/bookings', bookingId]);
              }, 2000);
            } else {
              this.processing = false;
              this.toastService.warning('Booking created but payment failed. Please complete payment.', 'Close', 6000);
              setTimeout(() => {
                this.router.navigate(['/bookings', bookingId]);
              }, 2000);
            }
          } catch (paymentError: any) {
            this.logger.error('Payment error', paymentError);
            this.processing = false;
            this.toastService.warning('Booking created but payment failed. Please complete payment.', 'Close', 6000);
            setTimeout(() => {
              this.router.navigate(['/bookings', bookingId]);
            }, 2000);
          }
        },
        error: (error) => {
          this.logger.error('Booking error', error);
          const errorMessage = error.error?.message || error.error?.error || 'Failed to create booking. Please try again.';
          this.toastService.error(errorMessage, 'Close', 5000);
          this.processing = false;
        }
      });
    } catch (error: any) {
      this.logger.error('Unexpected error', error);
      this.toastService.error('An unexpected error occurred. Please try again.', 'Close', 5000);
      this.processing = false;
    }
  }

  cancel(): void {
    this.router.navigate(['/services', this.service._id]);
  }
}
