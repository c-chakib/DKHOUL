import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, FormArray, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { MatStepperModule } from '@angular/material/stepper';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { ServiceService } from '../../../core/services/service.service';
import { UploadService } from '../../../core/services/upload.service';
import { LoggerService } from '../../../core/services/logger.service';
import { ToastService } from '../../../core/services/toast.service';

@Component({
  selector: 'app-service-create',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatIconModule,
    MatChipsModule,
    MatStepperModule,
    MatCheckboxModule,
    MatProgressSpinnerModule
  ],
  templateUrl: './service-create.component.html',
  styleUrl: './service-create.component.scss'
})
export class ServiceCreateComponent implements OnInit {
  serviceForm!: FormGroup;
  loading = false;
  selectedFiles: File[] = [];
  imagePreviews: string[] = [];
  categories = ['Space', 'Skills', 'Connect'];
  pricingTypes = [
    { value: 'per_hour', label: 'Per Hour' },
    { value: 'per_day', label: 'Per Day' },
    { value: 'fixed', label: 'Fixed Price' }
  ];
  daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
  amenitiesList = [
    'WiFi', 'Parking', 'Air Conditioning', 'Heating', 'Kitchen', 
    'TV', 'Workspace', 'Pool', 'Gym', 'Pets Allowed',
    'Smoking Allowed', 'Events Allowed', 'Wheelchair Accessible'
  ];

  constructor(
    private fb: FormBuilder,
    private serviceService: ServiceService,
    private uploadService: UploadService,
    private router: Router,
    private logger: LoggerService,
    private toastService: ToastService
  ) {}

  ngOnInit(): void {
    this.initializeForm();
  }

  initializeForm(): void {
    this.serviceForm = this.fb.group({
      // Basic Info
      title: ['', [Validators.required, Validators.minLength(10), Validators.maxLength(100)]],
      description: ['', [Validators.required, Validators.minLength(50), Validators.maxLength(1000)]],
      category: ['', Validators.required],
      
      // Pricing
      pricing: this.fb.group({
        amount: ['', [Validators.required, Validators.min(1)]],
        type: ['per_hour', Validators.required],
        currency: ['MAD']
      }),

      // Location
      location: this.fb.group({
        address: ['', Validators.required],
        city: ['', Validators.required],
        region: ['', Validators.required],
        country: ['Morocco'],
        coordinates: this.fb.group({
          latitude: [0],
          longitude: [0]
        })
      }),

      // Details
      maxGuests: [1, [Validators.min(1), Validators.max(50)]],
      duration: [60, Validators.min(30)],
      amenities: [[]],
      tags: [[]],

      // Availability
      availability: this.fb.group({
        days: [[]],
        startTime: ['09:00'],
        endTime: ['18:00'],
        advanceBooking: [1, Validators.min(0)],
        cancellationPolicy: ['flexible']
      }),

      // Rules
      rules: [[]]
    });
  }

  onFileSelected(event: any): void {
    const files: FileList = event.target.files;
    
    if (this.selectedFiles.length + files.length > 10) {
      this.toastService.error('Maximum 10 images allowed', 'Close', 5000);
      return;
    }

    if (this.selectedFiles.length + files.length < 3 && files.length < 3) {
      this.toastService.warning('Minimum 3 images required', 'Close', 5000);
    }

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      
      // Validate file type
      if (!file.type.startsWith('image/')) {
        this.toastService.error('Only image files are allowed', 'Close', 5000);
        continue;
      }

      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        this.toastService.error(`Image ${file.name} is too large. Max 5MB`, 'Close', 5000);
        continue;
      }

      this.selectedFiles.push(file);

      // Create preview
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.imagePreviews.push(e.target.result);
      };
      reader.readAsDataURL(file);
    }
  }

  removeImage(index: number): void {
    this.selectedFiles.splice(index, 1);
    this.imagePreviews.splice(index, 1);
  }

  toggleAmenity(amenity: string): void {
    const amenities = this.serviceForm.get('amenities')?.value || [];
    const index = amenities.indexOf(amenity);
    
    if (index > -1) {
      amenities.splice(index, 1);
    } else {
      amenities.push(amenity);
    }
    
    this.serviceForm.patchValue({ amenities });
  }

  isAmenitySelected(amenity: string): boolean {
    const amenities = this.serviceForm.get('amenities')?.value || [];
    return amenities.includes(amenity);
  }

  toggleDay(day: string): void {
    const days = this.serviceForm.get('availability.days')?.value || [];
    const index = days.indexOf(day);
    
    if (index > -1) {
      days.splice(index, 1);
    } else {
      days.push(day);
    }
    
    this.serviceForm.get('availability.days')?.patchValue(days);
  }

  isDaySelected(day: string): boolean {
    const days = this.serviceForm.get('availability.days')?.value || [];
    return days.includes(day);
  }

  async onSubmit(): Promise<void> {
    if (this.serviceForm.invalid) {
      this.toastService.error('Please fill all required fields', 'Close', 5000);
      Object.keys(this.serviceForm.controls).forEach(key => {
        const control = this.serviceForm.get(key);
        if (control?.invalid) {
          control.markAsTouched();
        }
      });
      return;
    }

    if (this.selectedFiles.length < 3) {
      this.toastService.error('Please upload at least 3 images', 'Close', 5000);
      return;
    }

    this.loading = true;

    try {
      // Upload images first
      const imageUrls: string[] = [];
      
      for (const file of this.selectedFiles) {
        try {
          const url = await this.uploadService.uploadImage(file, 'services').toPromise();
          if (url) {
            imageUrls.push(url);
          }
        } catch (uploadError: any) {
          this.logger.error('Error uploading image', uploadError);
          this.toastService.error(`Failed to upload ${file.name}`, 'Close', 5000);
        }
      }

      if (imageUrls.length === 0) {
        this.toastService.error('Failed to upload images. Please try again.', 'Close', 5000);
        this.loading = false;
        return;
      }

      // Prepare service data
      const serviceData = {
        ...this.serviceForm.value,
        images: imageUrls
      };

      // Create service
      this.serviceService.createService(serviceData).subscribe({
        next: (response) => {
          // Handle API response structure: { success: true, data: { service } }
          const service = response.data?.service || response.service || response;
          const serviceId = service._id || service.id;
          
          if (!serviceId) {
            this.logger.error('Service ID not found in response', response);
            this.toastService.error('Service created but ID not found. Please check your services.', 'Close', 5000);
            this.loading = false;
            return;
          }

          this.loading = false;
          this.toastService.success('Service created successfully', '', 5000);
          setTimeout(() => {
            this.router.navigate(['/services', serviceId]);
          }, 2000);
        },
        error: (error) => {
          this.logger.error('Error creating service', error);
          const errorMessage = error.error?.message || error.error?.error || 'Failed to create service. Please try again.';
          this.toastService.error(errorMessage, 'Close', 5000);
          this.loading = false;
        }
      });
    } catch (error: any) {
      this.logger.error('Error uploading images', error);
      this.toastService.error('Failed to upload images. Please try again.', 'Close', 5000);
      this.loading = false;
    }
  }

  cancel(): void {
    this.router.navigate(['/dashboard']);
  }
}
