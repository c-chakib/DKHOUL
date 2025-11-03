import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-verify-email',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule
  ],
  templateUrl: './verify-email.component.html',
  styleUrl: './verify-email.component.scss'
})
export class VerifyEmailComponent implements OnInit {
  verificationStatus: 'loading' | 'success' | 'error' = 'loading';
  errorMessage = '';

  constructor(
    private authService: AuthService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    const token = this.route.snapshot.params['token'];

    if (!token) {
      this.verificationStatus = 'error';
      this.errorMessage = 'Verification token is missing or invalid.';
      return;
    }

    this.verifyEmail(token);
  }

  verifyEmail(token: string): void {
    this.authService.verifyEmail(token).subscribe({
      next: () => {
        this.verificationStatus = 'success';
      },
      error: (error) => {
        this.verificationStatus = 'error';
        this.errorMessage = error.error?.message || 'Email verification failed. The link may have expired or is invalid.';
      }
    });
  }

  goToLogin(): void {
    this.router.navigate(['/auth/login']);
  }

  resendVerification(): void {
    // This would need to be implemented with a resend endpoint
    this.verificationStatus = 'loading';
    // For now, redirect to login where they can request a new verification
    setTimeout(() => {
      this.router.navigate(['/auth/login']);
    }, 2000);
  }
}
