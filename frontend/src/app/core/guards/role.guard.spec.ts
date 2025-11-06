import { TestBed } from '@angular/core/testing';
import { Router, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { roleGuard } from './role.guard';
import { AuthService } from '../services/auth.service';

describe('roleGuard', () => {
  let authService: jasmine.SpyObj<AuthService>;
  let router: jasmine.SpyObj<Router>;
  let mockRoute: ActivatedRouteSnapshot;
  let mockState: RouterStateSnapshot;

  beforeEach(() => {
    const authServiceSpy = jasmine.createSpyObj('AuthService', ['isAuthenticated'], {
      currentUserValue: null
    });
    const routerSpy = jasmine.createSpyObj('Router', ['navigate']);

    TestBed.configureTestingModule({
      providers: [
        { provide: AuthService, useValue: authServiceSpy },
        { provide: Router, useValue: routerSpy }
      ]
    });

    authService = TestBed.inject(AuthService) as jasmine.SpyObj<AuthService>;
    router = TestBed.inject(Router) as jasmine.SpyObj<Router>;

    mockRoute = {
      data: { roles: ['admin'] }
    } as unknown as ActivatedRouteSnapshot;
    mockState = { url: '/admin/dashboard' } as RouterStateSnapshot;
  });

  it('should redirect to login when user is not authenticated', () => {
    authService.isAuthenticated.and.returnValue(false);

    const result = TestBed.runInInjectionContext(() => 
      roleGuard(mockRoute, mockState)
    );

    expect(result).toBe(false);
    expect(router.navigate).toHaveBeenCalledWith(['/auth/login']);
  });

  it('should allow access when user has required role', () => {
    authService.isAuthenticated.and.returnValue(true);
    Object.defineProperty(authService, 'currentUserValue', {
      value: { _id: '123', email: 'admin@test.com', role: 'admin' },
      writable: true
    });

    const result = TestBed.runInInjectionContext(() => 
      roleGuard(mockRoute, mockState)
    );

    expect(result).toBe(true);
    expect(router.navigate).not.toHaveBeenCalled();
  });

  it('should deny access and redirect when user lacks required role', () => {
    authService.isAuthenticated.and.returnValue(true);
    Object.defineProperty(authService, 'currentUserValue', {
      value: { _id: '123', email: 'user@test.com', role: 'tourist' },
      writable: true
    });

    const result = TestBed.runInInjectionContext(() => 
      roleGuard(mockRoute, mockState)
    );

    expect(result).toBe(false);
    expect(router.navigate).toHaveBeenCalledWith(['/']);
  });

  it('should allow access when user role is in the list of allowed roles', () => {
    authService.isAuthenticated.and.returnValue(true);
    Object.defineProperty(authService, 'currentUserValue', {
      value: { _id: '123', email: 'provider@test.com', role: 'provider' },
      writable: true
    });
    mockRoute = {
      data: { roles: ['admin', 'provider'] }
    } as unknown as ActivatedRouteSnapshot;

    const result = TestBed.runInInjectionContext(() => 
      roleGuard(mockRoute, mockState)
    );

    expect(result).toBe(true);
  });

  it('should redirect to home when authenticated user has no role', () => {
    authService.isAuthenticated.and.returnValue(true);
    Object.defineProperty(authService, 'currentUserValue', {
      value: null,
      writable: true
    });

    const result = TestBed.runInInjectionContext(() => 
      roleGuard(mockRoute, mockState)
    );

    expect(result).toBe(false);
    expect(router.navigate).toHaveBeenCalledWith(['/']);
  });
});
