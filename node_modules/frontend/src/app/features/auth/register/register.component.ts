import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, AbstractControl, ValidationErrors } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSelectModule } from '@angular/material/select';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatStepperModule } from '@angular/material/stepper';
import { AuthService } from '../../../core/services/auth.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterLink,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatSelectModule,
    MatCheckboxModule,
    MatStepperModule
  ],
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss'
})
export class RegisterComponent implements OnInit {
  personalInfoForm!: FormGroup;
  accountInfoForm!: FormGroup;
  loading = false;
  hidePassword = true;
  hideConfirmPassword = true;

  roles = [
    { value: 'user', label: 'I want to book services' },
    { value: 'provider', label: 'I want to offer services' }
  ];

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.initForms();
  }

  initForms(): void {
    this.personalInfoForm = this.fb.group({
      firstName: ['', [Validators.required, Validators.minLength(2)]],
      lastName: ['', [Validators.required, Validators.minLength(2)]],
      phoneNumber: ['', [Validators.required, Validators.pattern(/^[+]?[\d\s-()]+$/)]]
    });

    this.accountInfoForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(8), this.passwordStrengthValidator]],
      confirmPassword: ['', Validators.required],
      role: ['user', Validators.required],
      agreeToTerms: [false, Validators.requiredTrue]
    }, { validators: this.passwordMatchValidator });
  }

  passwordStrengthValidator(control: AbstractControl): ValidationErrors | null {
    const value = control.value;
    if (!value) return null;

    const hasUpperCase = /[A-Z]/.test(value);
    const hasLowerCase = /[a-z]/.test(value);
    const hasNumber = /[0-9]/.test(value);
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(value);

    const passwordValid = hasUpperCase && hasLowerCase && hasNumber && hasSpecialChar;

    return passwordValid ? null : { weakPassword: true };
  }

  passwordMatchValidator(control: AbstractControl): ValidationErrors | null {
    const password = control.get('password');
    const confirmPassword = control.get('confirmPassword');

    if (!password || !confirmPassword) return null;

    return password.value === confirmPassword.value ? null : { passwordMismatch: true };
  }

  onSubmit(): void {
    if (this.personalInfoForm.invalid || this.accountInfoForm.invalid) {
      this.markFormGroupTouched(this.personalInfoForm);
      this.markFormGroupTouched(this.accountInfoForm);
      return;
    }

    this.loading = true;
    const formData = {
      ...this.personalInfoForm.value,
      ...this.accountInfoForm.value
    };
    delete formData.confirmPassword;
    delete formData.agreeToTerms;

    this.authService.register(formData).subscribe({
      next: (response) => {
        this.loading = false;
        Swal.fire({
          icon: 'success',
          title: 'Registration Successful!',
          html: `
            <p>Welcome to DKHOUL!</p>
            <p class="text-sm text-gray-600">Please check your email to verify your account.</p>
          `,
          confirmButtonText: 'Go to Login'
        }).then(() => {
          this.router.navigate(['/auth/login']);
        });
      },
      error: (error) => {
        this.loading = false;
        Swal.fire({
          icon: 'error',
          title: 'Registration Failed',
          text: error.error?.message || 'An error occurred during registration',
        });
      }
    });
  }

  private markFormGroupTouched(formGroup: FormGroup): void {
    Object.keys(formGroup.controls).forEach(key => {
      formGroup.get(key)?.markAsTouched();
    });
  }

  getErrorMessage(formGroup: FormGroup, field: string): string {
    const control = formGroup.get(field);
    if (!control) return '';

    if (control.hasError('required')) {
      return `${this.formatFieldName(field)} is required`;
    }
    if (control.hasError('email')) {
      return 'Please enter a valid email address';
    }
    if (control.hasError('minlength')) {
      const minLength = control.errors?.['minlength'].requiredLength;
      return `${this.formatFieldName(field)} must be at least ${minLength} characters`;
    }
    if (control.hasError('pattern')) {
      return 'Please enter a valid phone number';
    }
    if (control.hasError('weakPassword')) {
      return 'Password must contain uppercase, lowercase, number, and special character';
    }
    if (field === 'confirmPassword' && this.accountInfoForm.hasError('passwordMismatch')) {
      return 'Passwords do not match';
    }
    return '';
  }

  private formatFieldName(field: string): string {
    return field
      .replace(/([A-Z])/g, ' $1')
      .replace(/^./, str => str.toUpperCase())
      .trim();
  }

  getPasswordStrength(): { value: number; label: string; color: string } {
    const password = this.accountInfoForm.get('password')?.value || '';
    let strength = 0;

    if (password.length >= 8) strength++;
    if (/[A-Z]/.test(password)) strength++;
    if (/[a-z]/.test(password)) strength++;
    if (/[0-9]/.test(password)) strength++;
    if (/[!@#$%^&*(),.?":{}|<>]/.test(password)) strength++;

    const strengthLevels = [
      { value: 20, label: 'Very Weak', color: '#f44336' },
      { value: 40, label: 'Weak', color: '#ff9800' },
      { value: 60, label: 'Fair', color: '#ffc107' },
      { value: 80, label: 'Strong', color: '#8bc34a' },
      { value: 100, label: 'Very Strong', color: '#4caf50' }
    ];

    return strengthLevels[Math.max(0, strength - 1)] || strengthLevels[0];
  }
}

