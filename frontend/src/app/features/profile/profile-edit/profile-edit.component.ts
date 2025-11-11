import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatChipsModule } from '@angular/material/chips';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { UserService } from '../../../core/services/user.service';
import { UploadService } from '../../../core/services/upload.service';
import Swal from 'sweetalert2';
import { LoggerService } from '../../../core/services/logger.service';

@Component({
  selector: 'app-profile-edit',
  standalone: true,
  imports: [CommonModule, RouterModule, ReactiveFormsModule, MatCardModule, MatButtonModule, MatIconModule, 
            MatFormFieldModule, MatInputModule, MatSelectModule, MatChipsModule, MatProgressSpinnerModule],
  templateUrl: './profile-edit.component.html',
  styleUrl: './profile-edit.component.scss'
})
export class ProfileEditComponent implements OnInit {
  profileForm!: FormGroup;
  loading = false;
  avatarPreview: string | null = null;
  coverPreview: string | null = null;
  avatarFile: File | null = null;
  coverFile: File | null = null;

  constructor(
    private fb: FormBuilder,
    private userService: UserService,
    private uploadService: UploadService,
    private router: Router,
    private logger: LoggerService
  ) {}

  ngOnInit(): void {
    this.initForm();
    this.loadProfile();
  }

  initForm(): void {
    this.profileForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(2)]],
      email: ['', [Validators.required, Validators.email]],
      phone: [''],
      bio: ['', [Validators.maxLength(500)]],
      description: ['', [Validators.maxLength(1000)]],
      location: this.fb.group({
        address: [''],
        city: [''],
        country: ['']
      }),
      languages: [[]]
    });
  }

  loadProfile(): void {
    this.userService.getProfile().subscribe({
        next: (response: any) => {
          const user = response.data?.user || response.data || response;
        
          // Map backend fields to form fields
          const formData = {
            name: user.profile?.firstName && user.profile?.lastName 
              ? `${user.profile.firstName} ${user.profile.lastName}`.trim()
              : user.name || '',
            email: user.email || '',
            phone: user.profile?.phone || user.phone || '',
            bio: user.profile?.bio || user.bio || '',
            description: user.profile?.bio || user.bio || '',
            location: {
              address: user.address || '',
              city: user.city || '',
              country: user.country || ''
            },
            languages: user.profile?.languages || user.languages || []
          };
        
          this.profileForm.patchValue(formData);
          this.avatarPreview = user.profile?.photo || user.avatar || null;
          this.coverPreview = user.coverPhoto || null;
      },
      error: (error: any) => {
        this.logger.error('Error loading profile:', error);
        Swal.fire('Error', 'Failed to load profile', 'error');
      }
    });
  }

  onAvatarSelect(event: any): void {
    const file = event.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        Swal.fire('Error', 'File size must be less than 5MB', 'error');
        return;
      }
      this.avatarFile = file;
      const reader = new FileReader();
      reader.onload = (e: any) => this.avatarPreview = e.target.result;
      reader.readAsDataURL(file);
    }
  }

  onCoverSelect(event: any): void {
    const file = event.target.files[0];
    if (file) {
      if (file.size > 10 * 1024 * 1024) {
        Swal.fire('Error', 'File size must be less than 10MB', 'error');
        return;
      }
      this.coverFile = file;
      const reader = new FileReader();
      reader.onload = (e: any) => this.coverPreview = e.target.result;
      reader.readAsDataURL(file);
    }
  }

  async onSubmit(): Promise<void> {
    if (this.profileForm.invalid) {
      return;
    }

    this.loading = true;
    const formData = this.profileForm.value;

    try {
      // Upload avatar if changed
      if (this.avatarFile) {
        const avatarUrl = await this.uploadService.uploadImage(this.avatarFile).toPromise();
        formData.avatar = avatarUrl;
      }

      // Upload cover if changed
      if (this.coverFile) {
        const coverUrl = await this.uploadService.uploadImage(this.coverFile).toPromise();
        formData.coverPhoto = coverUrl;
      }

      this.userService.updateProfile(formData).subscribe({
        next: () => {
          Swal.fire('Success', 'Profile updated successfully', 'success');
          this.router.navigate(['/profile']);
        },
        error: (error: any) => {
          this.logger.error('Error updating profile:', error);
          Swal.fire('Error', 'Failed to update profile', 'error');
          this.loading = false;
        }
      });
    } catch (error) {
      this.logger.error('Error uploading images:', error);
      Swal.fire('Error', 'Failed to upload images', 'error');
      this.loading = false;
    }
  }

  cancel(): void {
    this.router.navigate(['/profile']);
  }
}


