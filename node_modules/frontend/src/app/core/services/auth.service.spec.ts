import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { AuthService } from './auth.service';
import { environment } from '../../../environments/environment';

describe('AuthService', () => {
  let service: AuthService;
  let httpMock: HttpTestingController;
  const apiUrl = environment.apiUrl;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [AuthService]
    });
    service = TestBed.inject(AuthService);
    httpMock = TestBed.inject(HttpTestingController);
    localStorage.clear();
  });

  afterEach(() => {
    httpMock.verify();
    localStorage.clear();
  });

  describe('register', () => {
    it('should register a new user successfully', (done) => {
      const mockUser = {
        email: 'test@example.com',
        password: 'password123',
        firstName: 'John',
        lastName: 'Doe',
        role: 'tourist' as const
      };

      const mockResponse = {
        success: true,
        message: 'Registration successful',
        data: {
          user: {
            _id: '123',
            email: mockUser.email,
            role: mockUser.role,
            profile: {
              firstName: mockUser.firstName,
              lastName: mockUser.lastName
            }
          },
          accessToken: 'mock-access-token',
          refreshToken: 'mock-refresh-token'
        }
      };

      service.register(mockUser).subscribe({
        next: (response) => {
          expect(response.success).toBe(true);
          expect(response.data.accessToken).toBe('mock-access-token');
          expect(response.data.user.email).toBe(mockUser.email);
          expect(localStorage.getItem('token')).toBe('mock-access-token');
          expect(localStorage.getItem('refreshToken')).toBe('mock-refresh-token');
          expect(localStorage.getItem('currentUser')).toBeTruthy();
          done();
        }
      });

      const req = httpMock.expectOne(`${apiUrl}/auth/register`);
      expect(req.request.method).toBe('POST');
      expect(req.request.body).toEqual(mockUser);
      req.flush(mockResponse);
    });

    it('should handle registration errors', (done) => {
      const mockUser = {
        email: 'test@example.com',
        password: 'password123',
        firstName: 'John',
        lastName: 'Doe',
        role: 'tourist' as const
      };

      service.register(mockUser).subscribe({
        error: (error) => {
          expect(error.status).toBe(400);
          expect(localStorage.getItem('token')).toBeNull();
          done();
        }
      });

      const req = httpMock.expectOne(`${apiUrl}/auth/register`);
      req.flush({ message: 'Email already exists' }, { status: 400, statusText: 'Bad Request' });
    });
  });

  describe('login', () => {
    it('should login user successfully', (done) => {
      const email = 'test@example.com';
      const password = 'password123';

      const mockResponse = {
        success: true,
        message: 'Login successful',
        data: {
          user: {
            _id: '123',
            email: email,
            role: 'tourist',
            profile: { firstName: 'John', lastName: 'Doe' }
          },
          accessToken: 'mock-access-token',
          refreshToken: 'mock-refresh-token'
        }
      };

      service.login(email, password).subscribe({
        next: (response) => {
          expect(response.success).toBe(true);
          expect(response.data.accessToken).toBe('mock-access-token');
          expect(response.data.user.email).toBe(email);
          expect(localStorage.getItem('token')).toBe('mock-access-token');
          expect(service.getCurrentUser()).toBeTruthy();
          done();
        }
      });

      const req = httpMock.expectOne(`${apiUrl}/auth/login`);
      expect(req.request.method).toBe('POST');
      expect(req.request.body).toEqual({ email, password });
      req.flush(mockResponse);
    });

    it('should handle invalid credentials', (done) => {
      const email = 'test@example.com';
      const password = 'wrongpassword';

      service.login(email, password).subscribe({
        error: (error) => {
          expect(error.status).toBe(401);
          expect(localStorage.getItem('token')).toBeNull();
          done();
        }
      });

      const req = httpMock.expectOne(`${apiUrl}/auth/login`);
      req.flush({ message: 'Invalid credentials' }, { status: 401, statusText: 'Unauthorized' });
    });
  });

  describe('googleLogin', () => {
    it('should login with Google successfully', (done) => {
      const idToken = 'mock-google-id-token';

      const mockResponse = {
        success: true,
        message: 'Login successful',
        data: {
          user: {
            _id: '123',
            email: 'test@gmail.com',
            role: 'tourist',
            profile: { firstName: 'John', lastName: 'Doe' },
            oauth: { googleId: 'google-123' }
          },
          accessToken: 'mock-access-token',
          refreshToken: 'mock-refresh-token'
        }
      };

      service.googleLogin(idToken).subscribe({
        next: (response) => {
          expect(response.success).toBe(true);
          expect(response.data.accessToken).toBe('mock-access-token');
          expect(response.data.user.oauth?.googleId).toBe('google-123');
          expect(localStorage.getItem('token')).toBe('mock-access-token');
          expect(service.getCurrentUser()?.oauth?.googleId).toBe('google-123');
          done();
        }
      });

      const req = httpMock.expectOne(`${apiUrl}/auth/google`);
      expect(req.request.method).toBe('POST');
      expect(req.request.body).toEqual({ idToken });
      req.flush(mockResponse);
    });

    it('should handle invalid Google token', (done) => {
      const idToken = 'invalid-token';

      service.googleLogin(idToken).subscribe({
        error: (error) => {
          expect(error.status).toBe(401);
          expect(localStorage.getItem('token')).toBeNull();
          done();
        }
      });

      const req = httpMock.expectOne(`${apiUrl}/auth/google`);
      req.flush({ message: 'Invalid Google token' }, { status: 401, statusText: 'Unauthorized' });
    });
  });

  describe('logout', () => {
    it('should clear user data and tokens on logout', () => {
      localStorage.setItem('token', 'mock-token');
      localStorage.setItem('refreshToken', 'mock-refresh');
      localStorage.setItem('currentUser', JSON.stringify({ _id: '123', email: 'test@example.com' }));

      service.logout();

      expect(localStorage.getItem('token')).toBeNull();
      expect(localStorage.getItem('refreshToken')).toBeNull();
      expect(localStorage.getItem('currentUser')).toBeNull();
      expect(service.getCurrentUser()).toBeNull();
    });
  });

  describe('isAuthenticated', () => {
    it('should return true when token exists', () => {
      localStorage.setItem('token', 'mock-token');
      expect(service.isAuthenticated()).toBe(true);
    });

    it('should return false when no token exists', () => {
      expect(service.isAuthenticated()).toBe(false);
    });
  });

  describe('getCurrentUser', () => {
    it('should return current user from localStorage', () => {
      const mockUser = { 
        _id: '123', 
        email: 'test@example.com', 
        role: 'tourist' as const,
        profile: {
          firstName: 'John',
          lastName: 'Doe'
        },
        verification: {
          email: false,
          phone: false,
          identity: false
        },
        createdAt: new Date(),
        updatedAt: new Date()
      };
      localStorage.setItem('currentUser', JSON.stringify(mockUser));

      const user = service.getCurrentUser();
      expect(user?._id).toBe('123');
      expect(user?.email).toBe('test@example.com');
    });

    it('should return null when no user in localStorage', () => {
      expect(service.getCurrentUser()).toBeNull();
    });
  });

  describe('hasRole', () => {
    it('should return true for matching role', () => {
      const mockUser = { _id: '123', email: 'test@example.com', role: 'admin' };
      localStorage.setItem('currentUser', JSON.stringify(mockUser));

      expect(service.hasRole('admin')).toBe(true);
    });

    it('should return false for non-matching role', () => {
      const mockUser = { _id: '123', email: 'test@example.com', role: 'tourist' };
      localStorage.setItem('currentUser', JSON.stringify(mockUser));

      expect(service.hasRole('admin')).toBe(false);
    });

    it('should return false when no user', () => {
      expect(service.hasRole('admin')).toBe(false);
    });
  });

  describe('getUserRole', () => {
    it('should return user role', () => {
      const mockUser = { _id: '123', email: 'test@example.com', role: 'provider' };
      localStorage.setItem('currentUser', JSON.stringify(mockUser));

      expect(service.getUserRole()).toBe('provider');
    });

    it('should return null when no user', () => {
      expect(service.getUserRole()).toBeNull();
    });
  });

  describe('verifyEmail', () => {
    it('should verify email with token', (done) => {
      const token = 'verification-token-123';
      const mockResponse = {
        success: true,
        message: 'Email verified successfully'
      };

      service.verifyEmail(token).subscribe({
        next: (response) => {
          expect(response).toEqual(mockResponse);
          done();
        }
      });

      const req = httpMock.expectOne(`${apiUrl}/auth/verify-email/${token}`);
      expect(req.request.method).toBe('GET');
      req.flush(mockResponse);
    });
  });

  describe('forgotPassword', () => {
    it('should send password reset email', (done) => {
      const email = 'test@example.com';
      const mockResponse = {
        success: true,
        message: 'Password reset email sent'
      };

      service.forgotPassword(email).subscribe({
        next: (response) => {
          expect(response).toEqual(mockResponse);
          done();
        }
      });

      const req = httpMock.expectOne(`${apiUrl}/auth/forgot-password`);
      expect(req.request.method).toBe('POST');
      expect(req.request.body).toEqual({ email });
      req.flush(mockResponse);
    });
  });

  describe('resetPassword', () => {
    it('should reset password with token', (done) => {
      const token = 'reset-token-123';
      const newPassword = 'newPassword123';
      const mockResponse = {
        success: true,
        message: 'Password reset successfully'
      };

      service.resetPassword(token, newPassword).subscribe({
        next: (response) => {
          expect(response).toEqual(mockResponse);
          done();
        }
      });

      const req = httpMock.expectOne(`${apiUrl}/auth/reset-password/${token}`);
      expect(req.request.method).toBe('POST');
      expect(req.request.body).toEqual({ password: newPassword });
      req.flush(mockResponse);
    });
  });

  describe('refreshToken', () => {
    it('should refresh access token', (done) => {
      const refreshToken = 'mock-refresh-token';
      localStorage.setItem('refreshToken', refreshToken);

      const mockResponse = {
        success: true,
        data: {
          accessToken: 'new-access-token'
        }
      };

      service.refreshToken().subscribe({
        next: (response) => {
          expect(response).toEqual(mockResponse);
          expect(localStorage.getItem('token')).toBe('new-access-token');
          done();
        }
      });

      const req = httpMock.expectOne(`${apiUrl}/auth/refresh-token`);
      expect(req.request.method).toBe('POST');
      expect(req.request.body).toEqual({ refreshToken });
      req.flush(mockResponse);
    });

    it('should handle missing refresh token', (done) => {
      service.refreshToken().subscribe({
        error: (error) => {
          expect(error.error.message).toContain('No refresh token');
          done();
        }
      });
    });
  });
});
