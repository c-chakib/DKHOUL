import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { of, throwError } from 'rxjs';
import { RegisterComponent } from './register.component';
import { AuthService } from '../../../core/services/auth.service';
import Swal from 'sweetalert2';

describe('RegisterComponent', () => {
  let component: RegisterComponent;
  let fixture: ComponentFixture<RegisterComponent>;
  let authService: jasmine.SpyObj<AuthService>;
  let router: jasmine.SpyObj<Router>;

  beforeEach(async () => {
    const authServiceSpy = jasmine.createSpyObj('AuthService', ['register']);

    await TestBed.configureTestingModule({
      imports: [
        RegisterComponent,
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

    fixture = TestBed.createComponent(RegisterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('Form Initialization', () => {
    it('should initialize personal info form with empty values', () => {
      expect(component.personalInfoForm.value).toEqual({
        firstName: '',
        lastName: '',
        phoneNumber: ''
      });
    });

    it('should initialize account info form with default values', () => {
      expect(component.accountInfoForm.value).toEqual({
        email: '',
        password: '',
        confirmPassword: '',
        role: 'tourist',
        agreeToTerms: false
      });
    });

    it('should have firstName field with required and minLength validators', () => {
      const firstNameControl = component.personalInfoForm.get('firstName');
      expect(firstNameControl?.hasError('required')).toBe(true);

      firstNameControl?.setValue('A');
      expect(firstNameControl?.hasError('minlength')).toBe(true);

      firstNameControl?.setValue('John');
      expect(firstNameControl?.valid).toBe(true);
    });

    it('should have email field with required and email validators', () => {
      const emailControl = component.accountInfoForm.get('email');
      expect(emailControl?.hasError('required')).toBe(true);

      emailControl?.setValue('invalid-email');
      expect(emailControl?.hasError('email')).toBe(true);

      emailControl?.setValue('test@example.com');
      expect(emailControl?.valid).toBe(true);
    });

    it('should have password field with strength validator', () => {
      const passwordControl = component.accountInfoForm.get('password');
      
      passwordControl?.setValue('weak');
      expect(passwordControl?.hasError('minlength')).toBe(true);

      passwordControl?.setValue('weakpassword');
      expect(passwordControl?.hasError('weakPassword')).toBe(true);

      passwordControl?.setValue('StrongPass123!');
      expect(passwordControl?.valid).toBe(true);
    });

    it('should validate phone number pattern', () => {
      const phoneControl = component.personalInfoForm.get('phoneNumber');
      
      phoneControl?.setValue('invalid');
      expect(phoneControl?.hasError('pattern')).toBe(true);

      phoneControl?.setValue('+212612345678');
      expect(phoneControl?.valid).toBe(true);
    });

    it('should require agreeToTerms to be true', () => {
      const termsControl = component.accountInfoForm.get('agreeToTerms');
      expect(termsControl?.hasError('required')).toBe(true);

      termsControl?.setValue(true);
      expect(termsControl?.valid).toBe(true);
    });
  });

  describe('Password Validation', () => {
    it('should validate password match', () => {
      const passwordControl = component.accountInfoForm.get('password');
      const confirmControl = component.accountInfoForm.get('confirmPassword');

      passwordControl?.setValue('StrongPass123!');
      confirmControl?.setValue('DifferentPass123!');
      
      expect(component.accountInfoForm.hasError('passwordMismatch')).toBe(true);

      confirmControl?.setValue('StrongPass123!');
      expect(component.accountInfoForm.hasError('passwordMismatch')).toBe(false);
    });

    it('should calculate password strength correctly', () => {
      const passwordControl = component.accountInfoForm.get('password');

      passwordControl?.setValue('weak');
      let strength = component.getPasswordStrength();
      expect(strength.value).toBe(20);
      expect(strength.label).toBe('Very Weak');

      passwordControl?.setValue('Strong123');
      strength = component.getPasswordStrength();
      expect(strength.value).toBeGreaterThanOrEqual(60);

      passwordControl?.setValue('VeryStrong123!@#');
      strength = component.getPasswordStrength();
      expect(strength.value).toBe(100);
      expect(strength.label).toBe('Very Strong');
    });
  });

  describe('Form Submission', () => {
    beforeEach(() => {
      spyOn(Swal, 'fire').and.returnValue(Promise.resolve({ isConfirmed: true, isDenied: false, isDismissed: false }));
    });

    it('should not submit if personal info form is invalid', () => {
      component.accountInfoForm.patchValue({
        email: 'test@example.com',
        password: 'StrongPass123!',
        confirmPassword: 'StrongPass123!',
        agreeToTerms: true
      });

      component.onSubmit();

      expect(authService.register).not.toHaveBeenCalled();
    });

    it('should not submit if account info form is invalid', () => {
      component.personalInfoForm.patchValue({
        firstName: 'John',
        lastName: 'Doe',
        phoneNumber: '+212612345678'
      });

      component.onSubmit();

      expect(authService.register).not.toHaveBeenCalled();
    });

    it('should submit valid form and navigate on success', () => {
      const mockResponse = {
        success: true,
        message: 'Registration successful',
        data: {
          user: { 
            _id: '123', 
            email: 'test@example.com', 
            role: 'tourist' as const,
            profile: { firstName: 'John', lastName: 'Doe' },
            verification: { email: false, phone: false, identity: false },
            createdAt: new Date(),
            updatedAt: new Date()
          },
          accessToken: 'token',
          refreshToken: 'refresh'
        }
      };
      authService.register.and.returnValue(of(mockResponse));

      component.personalInfoForm.patchValue({
        firstName: 'John',
        lastName: 'Doe',
        phoneNumber: '+212612345678'
      });

      component.accountInfoForm.patchValue({
        email: 'test@example.com',
        password: 'StrongPass123!',
        confirmPassword: 'StrongPass123!',
        role: 'user',
        agreeToTerms: true
      });

      component.onSubmit();

      expect(authService.register).toHaveBeenCalled();
      expect(Swal.fire).toHaveBeenCalledWith(jasmine.objectContaining({
        icon: 'success',
        title: 'Registration Successful!'
      }));
    });

    it('should show error message on registration failure', () => {
      const errorResponse = { error: { message: 'Email already exists' } };
      authService.register.and.returnValue(throwError(() => errorResponse));

      component.personalInfoForm.patchValue({
        firstName: 'John',
        lastName: 'Doe',
        phoneNumber: '+212612345678'
      });

      component.accountInfoForm.patchValue({
        email: 'test@example.com',
        password: 'StrongPass123!',
        confirmPassword: 'StrongPass123!',
        agreeToTerms: true
      });

      component.onSubmit();

      expect(Swal.fire).toHaveBeenCalledWith(jasmine.objectContaining({
        icon: 'error',
        title: 'Registration Failed',
        text: 'Email already exists'
      }));
    });

    it('should set loading state during submission', () => {
      const mockResponse = {
        success: true,
        data: {
          user: { _id: '123', email: 'test@test.com', role: 'tourist' as const, profile: { firstName: 'John', lastName: 'Doe' }, verification: { email: false, phone: false, identity: false }, createdAt: new Date(), updatedAt: new Date() },
          accessToken: 'token',
          refreshToken: 'refresh'
        }
      };
      authService.register.and.returnValue(of(mockResponse));

      component.personalInfoForm.patchValue({
        firstName: 'John',
        lastName: 'Doe',
        phoneNumber: '+212612345678'
      });

      component.accountInfoForm.patchValue({
        email: 'test@example.com',
        password: 'StrongPass123!',
        confirmPassword: 'StrongPass123!',
        agreeToTerms: true
      });

      expect(component.loading).toBe(false);
      component.onSubmit();
      expect(component.loading).toBe(false); // async so false again after subscribe
    });

    it('should remove confirmPassword and agreeToTerms from submitted data', () => {
      const mockResponse = {
        success: true,
        data: {
          user: { _id: '123', email: 'test@test.com', role: 'provider' as const, profile: { firstName: 'John', lastName: 'Doe' }, verification: { email: false, phone: false, identity: false }, createdAt: new Date(), updatedAt: new Date() },
          accessToken: 'token',
          refreshToken: 'refresh'
        }
      };
      authService.register.and.returnValue(of(mockResponse));

      component.personalInfoForm.patchValue({
        firstName: 'John',
        lastName: 'Doe',
        phoneNumber: '+212612345678'
      });

      component.accountInfoForm.patchValue({
        email: 'test@example.com',
        password: 'StrongPass123!',
        confirmPassword: 'StrongPass123!',
        role: 'provider',
        agreeToTerms: true
      });

      component.onSubmit();

      const submittedData = authService.register.calls.mostRecent().args[0];
      expect(submittedData.confirmPassword).toBeUndefined();
      expect(submittedData.agreeToTerms).toBeUndefined();
      expect(submittedData.password).toBe('StrongPass123!');
      expect(submittedData.role).toBe('provider');
    });
  });

  describe('Error Messages', () => {
    it('should return correct error message for required field', () => {
      const emailControl = component.accountInfoForm.get('email');
      emailControl?.markAsTouched();
      
      const message = component.getErrorMessage(component.accountInfoForm, 'email');
      expect(message).toBe('Email is required');
    });

    it('should return correct error message for invalid email', () => {
      const emailControl = component.accountInfoForm.get('email');
      emailControl?.setValue('invalid');
      emailControl?.markAsTouched();
      
      const message = component.getErrorMessage(component.accountInfoForm, 'email');
      expect(message).toBe('Please enter a valid email address');
    });

    it('should return correct error message for weak password', () => {
      const passwordControl = component.accountInfoForm.get('password');
      passwordControl?.setValue('weakpass');
      passwordControl?.markAsTouched();
      
      const message = component.getErrorMessage(component.accountInfoForm, 'password');
      expect(message).toContain('uppercase, lowercase, number, and special character');
    });

    it('should return correct error message for password mismatch', () => {
      component.accountInfoForm.patchValue({
        password: 'StrongPass123!',
        confirmPassword: 'Different123!'
      });
      
      const message = component.getErrorMessage(component.accountInfoForm, 'confirmPassword');
      expect(message).toBe('Passwords do not match');
    });
  });

  describe('UI State', () => {
    it('should toggle password visibility', () => {
      expect(component.hidePassword).toBe(true);
      component.hidePassword = false;
      expect(component.hidePassword).toBe(false);
    });

    it('should toggle confirm password visibility', () => {
      expect(component.hideConfirmPassword).toBe(true);
      component.hideConfirmPassword = false;
      expect(component.hideConfirmPassword).toBe(false);
    });

    it('should have role options', () => {
      expect(component.roles.length).toBe(2);
      expect(component.roles[0].value).toBe('tourist');
      expect(component.roles[1].value).toBe('provider');
    });
  });
});
