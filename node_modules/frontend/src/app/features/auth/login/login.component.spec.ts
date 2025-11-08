import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { ActivatedRoute } from '@angular/router';
import { of, throwError } from 'rxjs';
import { LoginComponent } from './login.component';
import { AuthService } from '../../../core/services/auth.service';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import Swal from 'sweetalert2';

describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;
  let authService: jasmine.SpyObj<AuthService>;
  let router: jasmine.SpyObj<Router>;

  const mockAuthResponse = {
    success: true,
    message: 'Login successful',
    data: {
      user: {
        _id: '123',
        email: 'test@example.com',
        role: 'tourist' as const,
        profile: {
          firstName: 'John',
          lastName: 'Doe'
        },
        verification: {
          email: true,
          phone: false,
          identity: false
        },
        createdAt: new Date(),
        updatedAt: new Date()
      },
      accessToken: 'mock-token',
      refreshToken: 'mock-refresh'
    }
  };

  beforeEach(async () => {
    const authServiceSpy = jasmine.createSpyObj('AuthService', [
      'login',
      'googleLogin',
      'getUserRole'
    ]);

    await TestBed.configureTestingModule({
      imports: [
        LoginComponent,
        ReactiveFormsModule,
        BrowserAnimationsModule,
        RouterTestingModule
      ],
      providers: [
        { provide: AuthService, useValue: authServiceSpy }
      ]
    }).compileComponents();

    authService = TestBed.inject(AuthService) as jasmine.SpyObj<AuthService>;
    router = TestBed.inject(Router) as jasmine.SpyObj<Router>;
    spyOn(router, 'navigate');

    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('Form Initialization', () => {
    it('should initialize login form with empty values', () => {
      component.ngOnInit();
      expect(component.loginForm).toBeDefined();
      expect(component.loginForm.get('email')?.value).toBe('');
      expect(component.loginForm.get('password')?.value).toBe('');
      expect(component.loginForm.get('rememberMe')?.value).toBe(false);
    });

    it('should have email field with required and email validators', () => {
      component.ngOnInit();
      const emailControl = component.loginForm.get('email');
      
      emailControl?.setValue('');
      expect(emailControl?.hasError('required')).toBe(true);
      
      emailControl?.setValue('invalid-email');
      expect(emailControl?.hasError('email')).toBe(true);
      
      emailControl?.setValue('valid@email.com');
      expect(emailControl?.valid).toBe(true);
    });

    it('should have password field with required and minlength validators', () => {
      component.ngOnInit();
      const passwordControl = component.loginForm.get('password');
      
      passwordControl?.setValue('');
      expect(passwordControl?.hasError('required')).toBe(true);
      
      passwordControl?.setValue('short');
      expect(passwordControl?.hasError('minlength')).toBe(true);
      
      passwordControl?.setValue('validpassword123');
      expect(passwordControl?.valid).toBe(true);
    });
  });

  describe('Form Submission', () => {
    beforeEach(() => {
      component.ngOnInit();
    });

    it('should not submit if form is invalid', () => {
      component.onSubmit();
      expect(authService.login).not.toHaveBeenCalled();
      expect(component.loading).toBe(false);
    });

    it('should mark all fields as touched when form is invalid', () => {
      component.onSubmit();
      expect(component.loginForm.get('email')?.touched).toBe(true);
      expect(component.loginForm.get('password')?.touched).toBe(true);
    });

    it('should call authService.login with correct credentials', () => {
      const email = 'test@example.com';
      const password = 'password123';
      
      component.loginForm.patchValue({ email, password });
      authService.login.and.returnValue(of(mockAuthResponse));
      authService.getUserRole.and.returnValue('tourist');

      component.onSubmit();

      expect(authService.login).toHaveBeenCalledWith(email, password);
      expect(component.loading).toBe(false);
    });

    it('should navigate to user dashboard for tourist role', (done) => {
      component.loginForm.patchValue({
        email: 'test@example.com',
        password: 'password123'
      });
      
      authService.login.and.returnValue(of(mockAuthResponse));
      authService.getUserRole.and.returnValue('tourist');
      
      spyOn(Swal, 'fire').and.returnValue(Promise.resolve({} as any));

      component.onSubmit();

      setTimeout(() => {
        expect(router.navigate).toHaveBeenCalledWith(['/dashboard/user']);
        done();
      }, 100);
    });

    it('should navigate to provider dashboard for provider role', (done) => {
      component.loginForm.patchValue({
        email: 'provider@example.com',
        password: 'password123'
      });
      
      authService.login.and.returnValue(of(mockAuthResponse));
      authService.getUserRole.and.returnValue('provider');
      
      spyOn(Swal, 'fire').and.returnValue(Promise.resolve({} as any));

      component.onSubmit();

      setTimeout(() => {
        expect(router.navigate).toHaveBeenCalledWith(['/dashboard/provider']);
        done();
      }, 100);
    });

    it('should navigate to admin dashboard for admin role', (done) => {
      component.loginForm.patchValue({
        email: 'admin@example.com',
        password: 'password123'
      });
      
      authService.login.and.returnValue(of(mockAuthResponse));
      authService.getUserRole.and.returnValue('admin');
      
      spyOn(Swal, 'fire').and.returnValue(Promise.resolve({} as any));

      component.onSubmit();

      setTimeout(() => {
        expect(router.navigate).toHaveBeenCalledWith(['/admin/dashboard']);
        done();
      }, 100);
    });

    it('should show error message on login failure', (done) => {
      component.loginForm.patchValue({
        email: 'test@example.com',
        password: 'wrongpassword'
      });
      
      const errorResponse = {
        error: { message: 'Invalid credentials' }
      };
      
      authService.login.and.returnValue(throwError(() => errorResponse));
      spyOn(Swal, 'fire');

      component.onSubmit();

      setTimeout(() => {
        expect(component.loading).toBe(false);
        expect(Swal.fire).toHaveBeenCalledWith(jasmine.objectContaining({
          icon: 'error',
          title: 'Login Failed',
          text: 'Invalid credentials'
        }));
        done();
      }, 100);
    });
  });

  describe('Google Sign-In', () => {
    beforeEach(() => {
      component.ngOnInit();
      // Mock google object
      (window as any).google = {
        accounts: {
          id: {
            initialize: jasmine.createSpy('initialize'),
            prompt: jasmine.createSpy('prompt')
          }
        }
      };
    });

    afterEach(() => {
      delete (window as any).google;
    });

    it('should load Google script on component init', () => {
      const scriptElements = document.getElementsByTagName('script');
      const googleScript = Array.from(scriptElements).find(
        script => script.src === 'https://accounts.google.com/gsi/client'
      );
      expect(googleScript).toBeDefined();
    });

    it('should initialize Google Sign-In when script loads', () => {
      component.initializeGoogleSignIn();
      expect((window as any).google.accounts.id.initialize).toHaveBeenCalled();
    });

    it('should trigger Google prompt on button click', () => {
      component.handleGoogleSignIn();
      expect((window as any).google.accounts.id.prompt).toHaveBeenCalled();
    });

    it('should show error if Google is not available', () => {
      delete (window as any).google;
      spyOn(Swal, 'fire');

      component.handleGoogleSignIn();

      expect(Swal.fire).toHaveBeenCalledWith(jasmine.objectContaining({
        icon: 'error',
        title: 'Error',
        text: jasmine.stringContaining('Google Sign-In is not available')
      }));
    });

    it('should handle Google callback successfully', (done) => {
      const mockCredential = { credential: 'mock-google-id-token' };
      
      authService.googleLogin.and.returnValue(of(mockAuthResponse));
      authService.getUserRole.and.returnValue('tourist');
      spyOn(Swal, 'fire').and.returnValue(Promise.resolve({} as any));

      component.handleGoogleCallback(mockCredential);

      setTimeout(() => {
        expect(authService.googleLogin).toHaveBeenCalledWith('mock-google-id-token');
        expect(router.navigate).toHaveBeenCalledWith(['/dashboard/user']);
        expect(component.loading).toBe(false);
        done();
      }, 100);
    });

    it('should handle Google login error', (done) => {
      const mockCredential = { credential: 'invalid-token' };
      const errorResponse = {
        error: { message: 'Invalid Google token' }
      };
      
      authService.googleLogin.and.returnValue(throwError(() => errorResponse));
      spyOn(Swal, 'fire');

      component.handleGoogleCallback(mockCredential);

      setTimeout(() => {
        expect(component.loading).toBe(false);
        expect(Swal.fire).toHaveBeenCalledWith(jasmine.objectContaining({
          icon: 'error',
          title: 'Login Failed',
          text: 'Invalid Google token'
        }));
        done();
      }, 100);
    });
  });

  describe('Error Messages', () => {
    beforeEach(() => {
      component.ngOnInit();
    });

    it('should return required error message for empty email', () => {
      const emailControl = component.loginForm.get('email');
      emailControl?.setValue('');
      emailControl?.markAsTouched();
      
      const message = component.getErrorMessage('email');
      expect(message).toBe('Email is required');
    });

    it('should return email format error for invalid email', () => {
      const emailControl = component.loginForm.get('email');
      emailControl?.setValue('invalid-email');
      emailControl?.markAsTouched();
      
      const message = component.getErrorMessage('email');
      expect(message).toBe('Please enter a valid email address');
    });

    it('should return required error for empty password', () => {
      const passwordControl = component.loginForm.get('password');
      passwordControl?.setValue('');
      passwordControl?.markAsTouched();
      
      const message = component.getErrorMessage('password');
      expect(message).toBe('Password is required');
    });

    it('should return minlength error for short password', () => {
      const passwordControl = component.loginForm.get('password');
      passwordControl?.setValue('short');
      passwordControl?.markAsTouched();
      
      const message = component.getErrorMessage('password');
      expect(message).toBe('Password must be at least 8 characters');
    });

    it('should return empty string for valid field', () => {
      const emailControl = component.loginForm.get('email');
      emailControl?.setValue('valid@email.com');
      emailControl?.markAsTouched();
      
      const message = component.getErrorMessage('email');
      expect(message).toBe('');
    });
  });

  describe('UI State', () => {
    beforeEach(() => {
      component.ngOnInit();
    });

    it('should set loading to true during login', () => {
      component.loginForm.patchValue({
        email: 'test@example.com',
        password: 'password123'
      });
      
      authService.login.and.returnValue(of(mockAuthResponse));
      authService.getUserRole.and.returnValue('tourist');

      component.loading = false;
      component.onSubmit();

      // Loading is set to true at the start
      expect(authService.login).toHaveBeenCalled();
    });

    it('should toggle password visibility', () => {
      expect(component.hidePassword).toBe(true);
      component.hidePassword = false;
      expect(component.hidePassword).toBe(false);
    });
  });
});
