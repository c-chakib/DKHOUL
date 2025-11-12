import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { AuthService } from '../../../core/services/auth.service';
import { LoggerService } from '../../../core/services/logger.service';
import { ToastService } from '../../../core/services/toast.service';
import { environment } from '../../../../environments/environment';

declare const google: any;

@Component({
  selector: 'app-login',
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
    MatCheckboxModule
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent implements OnInit {
  loginForm!: FormGroup;
  loading = false;
  hidePassword = true;
  googleReady = false;
  googleRendered = false;
  prompting = false;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private logger: LoggerService,
    private toastService: ToastService
  ) {}

  ngOnInit(): void {
    this.initForm();
    this.loadGoogleScript();
  }

  initForm(): void {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(8)]],
      rememberMe: [false]
    });
  }

  get email() {
    return this.loginForm.get('email');
  }

  get password() {
    return this.loginForm.get('password');
  }

  onSubmit(): void {
    if (this.loginForm.invalid) {
      Object.keys(this.loginForm.controls).forEach(key => {
        this.loginForm.get(key)?.markAsTouched();
      });
      return;
    }

    this.loading = true;
    const { email, password } = this.loginForm.value;

    this.authService.login(email, password).subscribe({
      next: (response) => {
        this.loading = false;
        this.toastService.success('Welcome back! Login successful');
        
        // Navigate based on user role
        const role = this.authService.getUserRole();
        if (role === 'admin') {
          this.router.navigate(['/admin']);
        } else if (role === 'provider') {
          this.router.navigate(['/dashboard']);
        } else {
          this.router.navigate(['/home']);
        }
      },
      error: (error) => {
        this.loading = false;
        const errorMessage = error.error?.message || error.error?.error || 'Invalid email or password. Please try again.';
        this.toastService.error(errorMessage, 'Close', 5000);
        this.logger.error('Login error', error);
      }
    });
  }

  getErrorMessage(field: string): string {
    const control = this.loginForm.get(field);
    if (!control || !control.touched || !control.errors) {
      return '';
    }
    
    if (control.hasError('required')) {
      return field === 'email' ? 'Email address is required' : 'Password is required';
    }
    if (control.hasError('email')) {
      return 'Please enter a valid email address';
    }
    if (control.hasError('minlength')) {
      const requiredLength = control.errors['minlength']?.requiredLength || 8;
      return `Password must be at least ${requiredLength} characters`;
    }
    return '';
  }

  loadGoogleScript(): void {
    const script = document.createElement('script');
    script.src = 'https://accounts.google.com/gsi/client';
    script.async = true;
    script.defer = true;
    script.onload = () => {
      this.initializeGoogleSignIn();
    };
    document.head.appendChild(script);
  }

  initializeGoogleSignIn(): void {
    if (typeof google !== 'undefined') {
      try {
        google.accounts.id.initialize({
          client_id: environment.googleClientId,
          callback: (response: any) => this.handleGoogleCallback(response),
          auto_select: false,
          cancel_on_tap_outside: true
        });
        this.googleReady = true;
        this.googleRendered = false;
        
        // Try to render the official Google button
        const container = document.getElementById('google-signin-container');
        if (container && typeof google !== 'undefined') {
          try {
            google.accounts.id.renderButton(container, {
              theme: 'outline',
              size: 'large',
              shape: 'pill',
              text: 'signin_with',
              width: 320,
              logo_alignment: 'left'
            });
            // Check if button was rendered
            setTimeout(() => {
              this.googleRendered = container.childElementCount > 0;
              if (!this.googleRendered) {
                this.logger.warn('Google OAuth button not rendered, showing fallback');
              } else {
                this.logger.debug('Google OAuth official button rendered successfully');
              }
            }, 100);
          } catch (renderErr) {
            this.logger.warn('Google OAuth renderButton failed; using fallback', renderErr);
            this.googleRendered = false;
          }
        }
      } catch (e) {
        this.logger.error('Google OAuth initialize error', e);
        this.googleReady = false;
        this.googleRendered = false;
      }
    }
  }

  handleGoogleSignIn(): void {
    // This is only called when using the fallback button
    // The official Google button handles its own click events
    if (typeof google === 'undefined' || !this.googleReady) {
      this.toastService.error('Google Sign-In is not available. Please try again later.', 'Close', 5000);
      return;
    }
    
    if (this.prompting) {
      this.logger.debug('Google OAuth already prompting, ignoring click');
      return;
    }
    
    this.prompting = true;
    this.logger.debug('Google OAuth fallback button clicked, triggering prompt');
    
    try {
      // For fallback button, trigger the One Tap prompt
      google.accounts.id.prompt((notification: any) => {
        if (notification.isNotDisplayed()) {
          this.logger.warn('Google OAuth prompt not displayed', notification.getNotDisplayedReason());
          this.prompting = false;
          this.toastService.info('Please ensure you are signed into Google and pop-ups are not blocked.', 'Close', 5000);
        } else if (notification.isSkippedMoment()) {
          this.logger.debug('Google OAuth prompt skipped by user');
          this.prompting = false;
        }
      });
      
      // Safety timeout
      setTimeout(() => {
        this.prompting = false;
      }, 15000);
    } catch (e) {
      this.logger.error('Google OAuth prompt error', e);
      this.prompting = false;
      this.toastService.error('Could not initialize Google Sign-In. Please try again.', 'Close', 5000);
    }
  }

  handleGoogleCallback(response: any): void {
    if (!response || !response.credential) {
      this.logger.error('Google OAuth callback without credential', response);
      this.toastService.error('No credential received. Please sign into Google and try again.', 'Close', 5000);
      this.prompting = false;
      return;
    }
    this.loading = true;
    const idToken = response.credential;

    this.authService.googleLogin(idToken).subscribe({
      next: (response) => {
        this.loading = false;
        this.prompting = false;
        this.toastService.success('Welcome! Login successful');
        
        // Navigate based on user role
        const role = this.authService.getUserRole();
        if (role === 'admin') {
          this.router.navigate(['/admin']);
        } else if (role === 'provider') {
          this.router.navigate(['/dashboard']);
        } else {
          this.router.navigate(['/home']);
        }
      },
      error: (error) => {
        this.loading = false;
        this.prompting = false;
        this.logger.error('Google OAuth backend login error', error);
        const errorMessage = error.error?.message || error.error?.error || 'Google login failed. Please try again.';
        this.toastService.error(errorMessage, 'Close', 5000);
      }
    });
  }
}

