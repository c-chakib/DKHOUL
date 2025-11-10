import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators, AbstractControl, ValidationErrors } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import Swal from 'sweetalert2';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-reset-password',
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
  templateUrl: './reset-password.component.html',
  styleUrl: './reset-password.component.scss'
})
export class ResetPasswordComponent implements OnInit {
  resetPasswordForm!: FormGroup;
  loading = false;
  hidePassword = true;
  hideConfirmPassword = true;
  token: string = '';

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    // Extract token from URL
    this.token = this.route.snapshot.params['token'];
    
    if (!this.token) {
      Swal.fire({
        icon: 'error',
        title: 'Invalid Link',
        text: 'This password reset link is invalid or has expired.',
        confirmButtonText: 'Go to Login',
        confirmButtonColor: '#667eea'
      }).then(() => {
        this.router.navigate(['/auth/login']);
      });
      return;
    }

    this.resetPasswordForm = this.fb.group({
      // Initialize controls with disabled set in code (not template) to avoid reactive form disabled binding warnings
      password: [{ value: '', disabled: false }, [Validators.required, Validators.minLength(8), this.passwordStrengthValidator()]],
      confirmPassword: [{ value: '', disabled: false }, [Validators.required]]
    }, {
      validators: this.passwordMatchValidator
    });
  }

  // Password strength validator
  passwordStrengthValidator() {
    return (control: AbstractControl): ValidationErrors | null => {
      const value = control.value;
      if (!value) return null;

      const hasUpperCase = /[A-Z]/.test(value);
      const hasLowerCase = /[a-z]/.test(value);
      const hasNumber = /[0-9]/.test(value);
      const hasSpecialChar = /[^a-zA-Z0-9]/.test(value);

      const valid = hasUpperCase && hasLowerCase && hasNumber && hasSpecialChar;

      if (!valid) {
        return {
          passwordStrength: 'Password must contain uppercase, lowercase, number, and special character'
        };
      }

      return null;
    };
  }

  // Password match validator
  passwordMatchValidator(group: AbstractControl): ValidationErrors | null {
    const password = group.get('password')?.value;
    const confirmPassword = group.get('confirmPassword')?.value;

    if (password && confirmPassword && password !== confirmPassword) {
      group.get('confirmPassword')?.setErrors({ passwordMismatch: true });
      return { passwordMismatch: true };
    }

    return null;
  }

  // Get password strength for visual indicator
  getPasswordStrength(): { value: number; label: string; color: string } {
    const password = this.resetPasswordForm.get('password')?.value;
    if (!password) {
      return { value: 0, label: 'No Password', color: '#ccc' };
    }

    let strength = 0;
    if (password.length >= 8) strength++;
    if (/[a-z]/.test(password)) strength++;
    if (/[A-Z]/.test(password)) strength++;
    if (/[0-9]/.test(password)) strength++;
    if (/[^a-zA-Z0-9]/.test(password)) strength++;

    const levels = [
      { value: 20, label: 'Very Weak', color: '#f44336' },
      { value: 40, label: 'Weak', color: '#ff9800' },
      { value: 60, label: 'Fair', color: '#ffc107' },
      { value: 80, label: 'Strong', color: '#8bc34a' },
      { value: 100, label: 'Very Strong', color: '#4caf50' }
    ];

    // Map 1..5 to indices 0..4, clamp within bounds
    const idx = Math.min(Math.max(strength - 1, 0), levels.length - 1);
    return levels[idx];
  }

  onSubmit(): void {
    if (this.resetPasswordForm.invalid) {
      this.markFormGroupTouched(this.resetPasswordForm);
      return;
    }
    // Read values before disabling the form (disabled controls are excluded from value)
    const { password } = this.resetPasswordForm.getRawValue();
    this.setLoading(true);

    this.authService.resetPassword(this.token, password).subscribe({
      next: () => {
        this.setLoading(false);
        
        Swal.fire({
          icon: 'success',
          title: 'Password Reset Successful!',
          text: 'Your password has been reset successfully. You can now log in with your new password.',
          confirmButtonText: 'Go to Login',
          confirmButtonColor: '#667eea'
        }).then(() => {
          this.router.navigate(['/auth/login']);
        });
      },
      error: (error: any) => {
        this.setLoading(false);
        
        Swal.fire({
          icon: 'error',
          title: 'Reset Failed',
          text: error.error?.message || 'Failed to reset password. The link may have expired.',
          confirmButtonText: 'Try Again',
          confirmButtonColor: '#667eea'
        });
      }
    });
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
    const control = this.resetPasswordForm.get(fieldName);
    
    if (control?.hasError('required')) {
      return `${this.formatFieldName(fieldName)} is required`;
    }
    
    if (control?.hasError('minlength')) {
      return `${this.formatFieldName(fieldName)} must be at least 8 characters`;
    }

    if (control?.hasError('passwordStrength')) {
      return control.errors?.['passwordStrength'];
    }

    if (control?.hasError('passwordMismatch')) {
      return 'Passwords do not match';
    }
    
    return '';
  }

  private formatFieldName(fieldName: string): string {
    return fieldName
      .replace(/([A-Z])/g, ' $1')
      .replace(/^./, str => str.toUpperCase())
      .trim();
  }

  // Helper methods for password requirements
  hasMinLength(): boolean {
    const password = this.resetPasswordForm.get('password')?.value;
    return password && password.length >= 8;
  }

  hasUpperCase(): boolean {
    const password = this.resetPasswordForm.get('password')?.value;
    return password && /[A-Z]/.test(password);
  }

  hasLowerCase(): boolean {
    const password = this.resetPasswordForm.get('password')?.value;
    return password && /[a-z]/.test(password);
  }

  hasNumber(): boolean {
    const password = this.resetPasswordForm.get('password')?.value;
    return password && /[0-9]/.test(password);
  }

  hasSpecialChar(): boolean {
    const password = this.resetPasswordForm.get('password')?.value;
    return password && /[^a-zA-Z0-9]/.test(password);
  }

  private setLoading(state: boolean): void {
    this.loading = state;
    if (!this.resetPasswordForm) return;
    if (state) {
      this.resetPasswordForm.disable({ emitEvent: false });
    } else {
      this.resetPasswordForm.enable({ emitEvent: false });
    }
  }
}
