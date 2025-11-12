import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { AuthService } from '../../../core/services/auth.service';
import { ToastService } from '../../../core/services/toast.service';
import { LoggerService } from '../../../core/services/logger.service';

@Component({
  selector: 'app-forgot-password',
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
    MatProgressSpinnerModule
  ],
  templateUrl: './forgot-password.component.html',
  styleUrl: './forgot-password.component.scss'
})
export class ForgotPasswordComponent implements OnInit {
  forgotPasswordForm!: FormGroup;
  loading = false;
  emailSent = false;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private toastService: ToastService,
    private logger: LoggerService
  ) {}

  ngOnInit(): void {
    // Initialize control without template [disabled] binding to avoid Angular's
    // "changed after checked" warning. We'll programmatically disable/enable
    // during loading states for better reactive form integration.
    this.forgotPasswordForm = this.fb.group({
      email: [{ value: '', disabled: false }, [Validators.required, Validators.email]]
    });
  }

  onSubmit(): void {
    if (this.forgotPasswordForm.invalid) {
      this.markFormGroupTouched(this.forgotPasswordForm);
      return;
    }
    this.setLoading(true);
    const email = this.forgotPasswordForm.value.email;

    this.authService.forgotPassword(email).subscribe({
      next: () => {
        this.setLoading(false);
        this.emailSent = true;
        this.toastService.success('Password reset instructions have been sent to your email address.', '', 5000);
      },
      error: (error) => {
        this.setLoading(false);
        const errorMessage = error.error?.message || error.error?.error || 'Failed to send reset email. Please try again.';
        this.toastService.error(errorMessage, 'Close', 5000);
        this.logger.error('Forgot password error', error);
      }
    });
  }

  resendEmail(): void {
    this.emailSent = false;
    this.onSubmit();
  }

  private markFormGroupTouched(formGroup: FormGroup): void {
    Object.keys(formGroup.controls).forEach(key => {
      const control = formGroup.get(key);
      control?.markAsTouched();

      if (control instanceof FormGroup) {
        this.markFormGroupTouched(control);
      }
    });
  }

  getErrorMessage(fieldName: string): string {
    const control = this.forgotPasswordForm.get(fieldName);
    
    if (control?.hasError('required')) {
      return `${this.formatFieldName(fieldName)} is required`;
    }
    
    if (control?.hasError('email')) {
      return 'Please enter a valid email address';
    }
    
    return '';
  }

  private formatFieldName(fieldName: string): string {
    return fieldName
      .replace(/([A-Z])/g, ' $1')
      .replace(/^./, str => str.toUpperCase())
      .trim();
  }

  private setLoading(state: boolean): void {
    this.loading = state;
    const emailControl = this.forgotPasswordForm.get('email');
    if (state) {
      emailControl?.disable({ emitEvent: false });
    } else {
      emailControl?.enable({ emitEvent: false });
    }
  }
}
