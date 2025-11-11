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
import { environment } from '../../../../environments/environment';
import Swal from 'sweetalert2';

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
    private logger: LoggerService
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
        Swal.fire({
          icon: 'success',
          title: 'Welcome Back!',
          text: 'Login successful',
          timer: 2000,
          showConfirmButton: false
        });
        
        // Navigate based on user role
        const role = this.authService.getUserRole();
        if (role === 'admin') {
          this.router.navigate(['/admin/dashboard']);
        } else if (role === 'provider') {
          this.router.navigate(['/dashboard/provider']);
        } else {
          this.router.navigate(['/dashboard/user']);
        }
      },
      error: (error) => {
        this.loading = false;
        Swal.fire({
          icon: 'error',
          title: 'Login Failed',
          text: error.error?.message || 'Invalid email or password',
        });
      }
    });
  }

  getErrorMessage(field: string): string {
    const control = this.loginForm.get(field);
    if (control?.hasError('required')) {
      return `${field.charAt(0).toUpperCase() + field.slice(1)} is required`;
    }
    if (control?.hasError('email')) {
      return 'Please enter a valid email address';
    }
    if (control?.hasError('minlength')) {
      return `${field.charAt(0).toUpperCase() + field.slice(1)} must be at least 8 characters`;
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
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Google Sign-In is not available. Please try again later.',
      });
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
          
          Swal.fire({
            icon: 'info',
            title: 'Google Sign-In',
            text: 'Please ensure you are signed into Google and pop-ups are not blocked.',
          });
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
      Swal.fire({
        icon: 'error',
        title: 'Google Sign-In failed',
        text: 'Could not initialize Google Sign-In. Please try again.',
      });
    }
  }

  handleGoogleCallback(response: any): void {
    if (!response || !response.credential) {
      this.logger.error('Google OAuth callback without credential', response);
      Swal.fire({
        icon: 'error',
        title: 'Google Sign-In failed',
        text: 'No credential received. Please sign into Google and try again.',
      });
      this.prompting = false;
      return;
    }
    this.loading = true;
    const idToken = response.credential;

    this.authService.googleLogin(idToken).subscribe({
      next: (response) => {
        this.loading = false;
        this.prompting = false;
        Swal.fire({
          icon: 'success',
          title: 'Welcome!',
          text: 'Login successful',
          timer: 2000,
          showConfirmButton: false
        });
        
        // Navigate based on user role
        const role = this.authService.getUserRole();
        if (role === 'admin') {
          this.router.navigate(['/admin/dashboard']);
        } else if (role === 'provider') {
          this.router.navigate(['/dashboard/provider']);
        } else {
          this.router.navigate(['/dashboard/user']);
        }
      },
      error: (error) => {
        this.loading = false;
        this.prompting = false;
        this.logger.error('Google OAuth backend login error', error);
        Swal.fire({
          icon: 'error',
          title: 'Login Failed',
          text: error.error?.message || 'Google login failed. Please try again.',
        });
      }
    });
  }
}

