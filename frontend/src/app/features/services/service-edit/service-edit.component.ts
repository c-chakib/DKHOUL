import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { ServiceService } from '../../../core/services/service.service';
import { UploadService } from '../../../core/services/upload.service';
import { LoggerService } from '../../../core/services/logger.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-service-edit',
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
    MatCheckboxModule,
    MatProgressSpinnerModule
  ],
  templateUrl: './service-edit.component.html',
  styleUrl: './service-edit.component.scss'
})
export class ServiceEditComponent implements OnInit {
  serviceId!: string;
  serviceForm!: FormGroup;
  loading = true;
  saving = false;
  service: any = null;
  existingImages: string[] = [];
  newFiles: File[] = [];
  newPreviews: string[] = [];
  
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
    private route: ActivatedRoute,
    private router: Router,
    private serviceService: ServiceService,
    private uploadService: UploadService,
    private logger: LoggerService
  ) {}

  ngOnInit(): void {
    this.serviceId = this.route.snapshot.params['id'];
    this.initializeForm();
    this.loadService();
  }

  initializeForm(): void {
    this.serviceForm = this.fb.group({
      title: ['', [Validators.required, Validators.minLength(10)]],
      description: ['', [Validators.required, Validators.minLength(50)]],
      category: ['', Validators.required],
      pricing: this.fb.group({
        amount: ['', [Validators.required, Validators.min(1)]],
        type: ['per_hour', Validators.required],
        currency: ['MAD']
      }),
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
      maxGuests: [1, Validators.min(1)],
      duration: [60, Validators.min(30)],
      amenities: [[]],
      tags: [[]],
      availability: this.fb.group({
        days: [[]],
        startTime: ['09:00'],
        endTime: ['18:00'],
        advanceBooking: [1],
        cancellationPolicy: ['flexible']
      }),
      rules: [[]]
    });
  }

  loadService(): void {
    this.serviceService.getServiceById(this.serviceId).subscribe({
      next: (service) => {
        this.service = service;
        this.existingImages = [...service.images];
        this.serviceForm.patchValue(service);
        this.loading = false;
      },
      error: (error) => {
        this.logger.error('Error loading service', error);
        Swal.fire('Error', 'Failed to load service', 'error');
        this.router.navigate(['/dashboard']);
      }
    });
  }

  onFileSelected(event: any): void {
    const files: FileList = event.target.files;
    const totalImages = this.existingImages.length + this.newFiles.length + files.length;

    if (totalImages > 10) {
      Swal.fire('Error', 'Maximum 10 images allowed', 'error');
      return;
    }

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      
      if (!file.type.startsWith('image/')) continue;
      if (file.size > 5 * 1024 * 1024) {
        Swal.fire('Error', `Image ${file.name} is too large. Max 5MB`, 'error');
        continue;
      }

      this.newFiles.push(file);

      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.newPreviews.push(e.target.result);
      };
      reader.readAsDataURL(file);
    }
  }

  removeExistingImage(index: number): void {
    this.existingImages.splice(index, 1);
  }

  removeNewImage(index: number): void {
    this.newFiles.splice(index, 1);
    this.newPreviews.splice(index, 1);
  }

  toggleAmenity(amenity: string): void {
    const amenities = this.serviceForm.get('amenities')?.value || [];
    const index = amenities.indexOf(amenity);
    if (index > -1) amenities.splice(index, 1);
    else amenities.push(amenity);
    this.serviceForm.patchValue({ amenities });
  }

  isAmenitySelected(amenity: string): boolean {
    return (this.serviceForm.get('amenities')?.value || []).includes(amenity);
  }

  toggleDay(day: string): void {
    const days = this.serviceForm.get('availability.days')?.value || [];
    const index = days.indexOf(day);
    if (index > -1) days.splice(index, 1);
    else days.push(day);
    this.serviceForm.get('availability.days')?.patchValue(days);
  }

  isDaySelected(day: string): boolean {
    return (this.serviceForm.get('availability.days')?.value || []).includes(day);
  }

  async onSubmit(): Promise<void> {
    if (this.serviceForm.invalid) {
      Swal.fire('Error', 'Please fill all required fields', 'error');
      return;
    }

    const totalImages = this.existingImages.length + this.newFiles.length;
    if (totalImages < 3) {
      Swal.fire('Error', 'Please have at least 3 images', 'error');
      return;
    }

    this.saving = true;

    try {
      // Upload new images
      const newImageUrls: string[] = [];
      for (const file of this.newFiles) {
        const url = await this.uploadService.uploadImage(file, 'services').toPromise();
        if (url) newImageUrls.push(url);
      }

      // Combine existing and new images
      const allImages = [...this.existingImages, ...newImageUrls];

      // Prepare update data
      const updateData = {
        ...this.serviceForm.value,
        images: allImages
      };

      // Update service
      this.serviceService.updateService(this.serviceId, updateData).subscribe({
        next: () => {
          Swal.fire('Success!', 'Service updated successfully', 'success');
          this.router.navigate(['/services', this.serviceId]);
        },
        error: (error) => {
          this.logger.error('Error updating service', error);
          Swal.fire('Error', error.error?.message || 'Failed to update service', 'error');
          this.saving = false;
        }
      });
    } catch (error) {
      this.logger.error('Error uploading images', error);
      Swal.fire('Error', 'Failed to upload images', 'error');
      this.saving = false;
    }
  }

  deleteService(): void {
    Swal.fire({
      title: 'Delete Service?',
      text: 'This action cannot be undone',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Yes, delete it!'
    }).then((result) => {
      if (result.isConfirmed) {
        this.serviceService.deleteService(this.serviceId).subscribe({
          next: () => {
            Swal.fire('Deleted!', 'Service has been deleted', 'success');
            this.router.navigate(['/dashboard']);
          },
          error: (error) => {
            Swal.fire('Error', 'Failed to delete service', 'error');
          }
        });
      }
    });
  }

  cancel(): void {
    this.router.navigate(['/services', this.serviceId]);
  }
}
