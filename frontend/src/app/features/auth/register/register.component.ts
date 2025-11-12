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
import { ToastService } from '../../../core/services/toast.service';
import { LoggerService } from '../../../core/services/logger.service';

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
  registrationForm!: FormGroup;
  personalInfoForm!: FormGroup;
  accountInfoForm!: FormGroup;
  loading = false;
  hidePassword = true;
  hideConfirmPassword = true;

  roles = [
    { value: 'tourist', label: 'I want to book services' },
    { value: 'provider', label: 'I want to offer services' }
  ];

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private toastService: ToastService,
    private logger: LoggerService
  ) {}

  ngOnInit(): void {
    this.initForms();
  }

  initForms(): void {
    // Single form for modern UI
    this.registrationForm = this.fb.group({
      firstName: ['', [Validators.required, Validators.minLength(2)]],
      lastName: ['', [Validators.required, Validators.minLength(2)]],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', [Validators.required, Validators.pattern(/^[+]?[\d\s-()]+$/)]],
      password: ['', [Validators.required, Validators.minLength(8), this.passwordStrengthValidator]],
      confirmPassword: ['', Validators.required],
      role: ['tourist', Validators.required],
      agreeToTerms: [false, Validators.requiredTrue]
    }, { validators: this.passwordMatchValidator });

    // Keep old forms for backward compatibility
    this.personalInfoForm = this.fb.group({
      firstName: ['', [Validators.required, Validators.minLength(2)]],
      lastName: ['', [Validators.required, Validators.minLength(2)]],
      phoneNumber: ['', [Validators.required, Validators.pattern(/^[+]?[\d\s-()]+$/)]]
    });

    this.accountInfoForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(8), this.passwordStrengthValidator]],
      confirmPassword: ['', Validators.required],
      role: ['tourist', Validators.required],
      agreeToTerms: [false, Validators.requiredTrue]
    }, { validators: this.passwordMatchValidator });
  }
  
  // Getters for form controls
  get firstName() { return this.registrationForm.get('firstName'); }
  get lastName() { return this.registrationForm.get('lastName'); }
  get email() { return this.registrationForm.get('email'); }
  get phone() { return this.registrationForm.get('phone'); }
  get password() { return this.registrationForm.get('password'); }
  get confirmPassword() { return this.registrationForm.get('confirmPassword'); }
  get role() { return this.registrationForm.get('role'); }
  get agreeToTerms() { return this.registrationForm.get('agreeToTerms'); }

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
    // Use modern single form if available
    if (this.registrationForm && this.registrationForm.touched) {
      if (this.registrationForm.invalid) {
        this.markFormGroupTouched(this.registrationForm);
        return;
      }
      
      this.loading = true;
      const formData = { ...this.registrationForm.value };
      
      // Map phone to phoneNumber for backend
      if (formData.phone) {
        formData.phoneNumber = formData.phone;
        delete formData.phone;
      }
      
      delete formData.confirmPassword;
      delete formData.agreeToTerms;

      this.authService.register(formData).subscribe({
        next: (response) => {
          this.loading = false;
          this.toastService.success('Registration successful! Please check your email to verify your account.', '', 5000);
          // Navigate after a short delay to show the toast
          setTimeout(() => {
            this.router.navigate(['/auth/login']);
          }, 2000);
        },
        error: (error) => {
          this.loading = false;
          const errorMessage = error.error?.message || error.error?.error || 'Registration failed. Please try again.';
          this.toastService.error(errorMessage, 'Close', 5000);
          this.logger.error('Registration error', error);
        }
      });
      return;
    }

    // Fallback to old stepper forms
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
        this.toastService.success('Registration successful! Please check your email to verify your account.', '', 5000);
        // Navigate after a short delay to show the toast
        setTimeout(() => {
          this.router.navigate(['/auth/login']);
        }, 2000);
      },
      error: (error) => {
        this.loading = false;
        const errorMessage = error.error?.message || error.error?.error || 'An error occurred during registration. Please try again.';
        this.toastService.error(errorMessage, 'Close', 5000);
        this.logger.error('Registration error', error);
      }
    });
  }

  private markFormGroupTouched(formGroup: FormGroup): void {
    Object.keys(formGroup.controls).forEach(key => {
      formGroup.get(key)?.markAsTouched();
    });
  }

  // Support both old stepper format (formGroup, field) and new single form format (field only)
  getErrorMessage(formGroupOrField: FormGroup | string, field?: string): string {
    let control;
    let fieldName: string;
    
    // New single form format: getErrorMessage('email')
    if (typeof formGroupOrField === 'string' && !field) {
      control = this.registrationForm?.get(formGroupOrField);
      fieldName = formGroupOrField;
    }
    // Old stepper format: getErrorMessage(formGroup, 'email')
    else if (formGroupOrField instanceof FormGroup && field) {
      control = formGroupOrField.get(field);
      fieldName = field;
    } else {
      return '';
    }
    
    if (!control) return '';

    if (control.hasError('required')) {
      return `${this.formatFieldName(fieldName)} is required`;
    }
    if (control.hasError('email')) {
      return 'Please enter a valid email address';
    }
    if (control.hasError('minlength')) {
      const minLength = control.errors?.['minlength'].requiredLength;
      return `${this.formatFieldName(fieldName)} must be at least ${minLength} characters`;
    }
    if (control.hasError('pattern')) {
      return 'Please enter a valid phone number';
    }
    if (control.hasError('weakPassword')) {
      return 'Password must contain uppercase, lowercase, number, and special character';
    }
    if (fieldName === 'confirmPassword') {
      const formGroup = typeof formGroupOrField === 'string' ? this.registrationForm : formGroupOrField;
      if (formGroup?.hasError('passwordMismatch')) {
        return 'Passwords do not match';
      }
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

