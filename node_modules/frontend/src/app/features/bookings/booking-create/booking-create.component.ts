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
import Swal from 'sweetalert2';

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
    private paymentService: PaymentService
  ) {}

  ngOnInit(): void {
    const serviceId = this.route.snapshot.queryParams['serviceId'];
    if (!serviceId) {
      Swal.fire('Error', 'Service not found', 'error');
      this.router.navigate(['/services']);
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
      next: (service) => {
        this.service = service;
        this.basePrice = service.pricing.amount;
        
        // Set default duration and guests from service
        if (service.duration) {
          this.bookingForm.patchValue({ duration: service.duration / 60 }); // Convert minutes to hours
        }
        
        this.calculatePrice();
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading service:', error);
        Swal.fire('Error', 'Failed to load service', 'error');
        this.router.navigate(['/services']);
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
      Swal.fire('Error', 'Please fill all required fields', 'error');
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
        next: async (booking) => {
          // Process payment
          try {
            const paymentResult = await this.paymentService.processPayment({
              bookingId: booking._id,
              amount: this.totalPrice,
              currency: 'MAD'
            }).toPromise();

            if (paymentResult.success) {
              Swal.fire('Success!', 'Booking confirmed! Payment processed.', 'success');
              this.router.navigate(['/bookings', booking._id]);
            } else {
              Swal.fire('Warning', 'Booking created but payment failed. Please complete payment.', 'warning');
              this.router.navigate(['/bookings', booking._id]);
            }
          } catch (paymentError) {
            console.error('Payment error:', paymentError);
            Swal.fire('Warning', 'Booking created but payment failed. Please complete payment.', 'warning');
            this.router.navigate(['/bookings', booking._id]);
          }
        },
        error: (error) => {
          console.error('Booking error:', error);
          Swal.fire('Error', error.error?.message || 'Failed to create booking', 'error');
          this.processing = false;
        }
      });
    } catch (error) {
      console.error('Error:', error);
      Swal.fire('Error', 'An unexpected error occurred', 'error');
      this.processing = false;
    }
  }

  cancel(): void {
    this.router.navigate(['/services', this.service._id]);
  }
}
