import { TestBed } from '@angular/core/testing';
import { HttpInterceptorFn, HttpRequest, HttpHandlerFn } from '@angular/common/http';
import { authInterceptor } from './auth.interceptor';
import { of } from 'rxjs';

describe('authInterceptor', () => {
  let mockHandler: HttpHandlerFn;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    localStorage.clear();
    
    mockHandler = jasmine.createSpy('HttpHandlerFn').and.returnValue(of({
      status: 200,
      statusText: 'OK',
      body: {},
      type: 4
    }));
  });

  afterEach(() => {
    localStorage.clear();
  });

  it('should add Authorization header when token exists', () => {
    const token = 'test-token-123';
    localStorage.setItem('token', token);

    const req = new HttpRequest('GET', 'http://localhost:3000/api/services');

    TestBed.runInInjectionContext(() => {
      authInterceptor(req, mockHandler);
    });

    expect(mockHandler).toHaveBeenCalled();
    const clonedReq = (mockHandler as jasmine.Spy).calls.mostRecent().args[0];
    expect(clonedReq.headers.get('Authorization')).toBe(`Bearer ${token}`);
  });

  it('should not add Authorization header when no token exists', () => {
    const req = new HttpRequest('GET', 'http://localhost:3000/api/services');

    TestBed.runInInjectionContext(() => {
      authInterceptor(req, mockHandler);
    });

    expect(mockHandler).toHaveBeenCalled();
    const clonedReq = (mockHandler as jasmine.Spy).calls.mostRecent().args[0];
    expect(clonedReq.headers.has('Authorization')).toBe(false);
  });

  it('should not add Authorization header for login requests', () => {
    localStorage.setItem('token', 'test-token');
    const req = new HttpRequest('POST', 'http://localhost:3000/api/auth/login', {
      email: 'test@test.com',
      password: 'password'
    });

    TestBed.runInInjectionContext(() => {
      authInterceptor(req, mockHandler);
    });

    const clonedReq = (mockHandler as jasmine.Spy).calls.mostRecent().args[0];
    expect(clonedReq.headers.has('Authorization')).toBe(false);
  });

  it('should not add Authorization header for register requests', () => {
    localStorage.setItem('token', 'test-token');
    const req = new HttpRequest('POST', 'http://localhost:3000/api/auth/register', {});

    TestBed.runInInjectionContext(() => {
      authInterceptor(req, mockHandler);
    });

    const clonedReq = (mockHandler as jasmine.Spy).calls.mostRecent().args[0];
    expect(clonedReq.headers.has('Authorization')).toBe(false);
  });

  it('should not add Authorization header for forgot-password requests', () => {
    localStorage.setItem('token', 'test-token');
    const req = new HttpRequest('POST', 'http://localhost:3000/api/auth/forgot-password', {});

    TestBed.runInInjectionContext(() => {
      authInterceptor(req, mockHandler);
    });

    const clonedReq = (mockHandler as jasmine.Spy).calls.mostRecent().args[0];
    expect(clonedReq.headers.has('Authorization')).toBe(false);
  });

  it('should not add Authorization header for reset-password requests', () => {
    localStorage.setItem('token', 'test-token');
    const req = new HttpRequest('POST', 'http://localhost:3000/api/auth/reset-password/token123', {});

    TestBed.runInInjectionContext(() => {
      authInterceptor(req, mockHandler);
    });

    const clonedReq = (mockHandler as jasmine.Spy).calls.mostRecent().args[0];
    expect(clonedReq.headers.has('Authorization')).toBe(false);
  });

  it('should add Authorization header for other authenticated requests', () => {
    localStorage.setItem('token', 'test-token');
    const req = new HttpRequest('GET', 'http://localhost:3000/api/bookings');

    TestBed.runInInjectionContext(() => {
      authInterceptor(req, mockHandler);
    });

    const clonedReq = (mockHandler as jasmine.Spy).calls.mostRecent().args[0];
    expect(clonedReq.headers.get('Authorization')).toBe('Bearer test-token');
  });

  it('should pass the request through to next handler', () => {
    const req = new HttpRequest('GET', 'http://localhost:3000/api/services');

    TestBed.runInInjectionContext(() => {
      authInterceptor(req, mockHandler);
    });

    expect(mockHandler).toHaveBeenCalledTimes(1);
  });
});
