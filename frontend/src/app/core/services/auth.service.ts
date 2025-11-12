import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import { Router } from '@angular/router';
import { User } from '../../models/user';
import { environment } from '../../../environments/environment';

interface AuthResponse {
  success: boolean;
  data: {
    accessToken: string;
    refreshToken: string;
    user: User;
  };
}

// Helper function to normalize user role from backend to frontend
// Backend uses 'host' but frontend uses 'provider' for consistency
function normalizeUserRole(user: any): User {
  if (user && user.role === 'host') {
    user.role = 'provider' as any;
  }
  return user;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  // Use environment apiUrl so tests and runtime share the same base URL
  private apiUrl = environment.apiUrl;
  private currentUserSubject: BehaviorSubject<User | null>;
  public currentUser: Observable<User | null>;

  constructor(
    private http: HttpClient,
    private router: Router
  ) {
    const storedUser = localStorage.getItem('currentUser');
    const user = storedUser ? JSON.parse(storedUser) : null;
    // Normalize role when loading from storage
    if (user) {
      normalizeUserRole(user);
    }
    this.currentUserSubject = new BehaviorSubject<User | null>(user);
    this.currentUser = this.currentUserSubject.asObservable();
  }

  public get currentUserValue(): User | null {
    return this.currentUserSubject.value;
  }

  register(userData: any): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/auth/register`, userData)
      .pipe(
        map(response => {
          // Normalize role: backend uses 'host' but frontend uses 'provider'
          if (response.success && response.data.user) {
            response.data.user = normalizeUserRole(response.data.user);
          }
          return response;
        }),
        tap(response => {
          if (response.success) {
            localStorage.setItem('token', response.data.accessToken);
            localStorage.setItem('refreshToken', response.data.refreshToken);
            localStorage.setItem('currentUser', JSON.stringify(response.data.user));
            this.currentUserSubject.next(response.data.user);
          }
        })
      );
  }

  login(email: string, password: string): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/auth/login`, { email, password })
      .pipe(
        map(response => {
          // Normalize role: backend uses 'host' but frontend uses 'provider'
          if (response.success && response.data.user) {
            response.data.user = normalizeUserRole(response.data.user);
          }
          return response;
        }),
        tap(response => {
          if (response.success) {
            localStorage.setItem('token', response.data.accessToken);
            localStorage.setItem('refreshToken', response.data.refreshToken);
            localStorage.setItem('currentUser', JSON.stringify(response.data.user));
            this.currentUserSubject.next(response.data.user);
          }
        })
      );
  }

  googleLogin(idToken: string): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/auth/google`, { idToken })
      .pipe(
        map(response => {
          // Normalize role: backend uses 'host' but frontend uses 'provider'
          if (response.success && response.data.user) {
            response.data.user = normalizeUserRole(response.data.user);
          }
          return response;
        }),
        tap(response => {
          if (response.success) {
            localStorage.setItem('token', response.data.accessToken);
            localStorage.setItem('refreshToken', response.data.refreshToken);
            localStorage.setItem('currentUser', JSON.stringify(response.data.user));
            this.currentUserSubject.next(response.data.user);
          }
        })
      );
  }

  logout(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('currentUser');
    this.currentUserSubject.next(null);
    this.router.navigate(['/auth/login']);
  }

  getToken(): string | null {
    return localStorage.getItem('token');
  }

  isAuthenticated(): boolean {
    return !!this.getToken();
  }

  hasRole(role: string): boolean {
    const user = this.getCurrentUser();
    return user ? user.role === role : false;
  }

  refreshToken(): Observable<any> {
    const refreshToken = localStorage.getItem('refreshToken');
    if (!refreshToken) {
      return new Observable(observer => {
        observer.error({ error: { message: 'No refresh token available' } });
        observer.complete();
      });
    }
    // Backend endpoint is /api/auth/refresh
    return this.http.post<{ success: boolean; data: { accessToken: string } }>(`${this.apiUrl}/auth/refresh`, { refreshToken })
      .pipe(
        tap(response => {
          if (response.success) {
            localStorage.setItem('token', response.data.accessToken);
          }
        })
      );
  }

  forgotPassword(email: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/auth/forgot-password`, { email });
  }

  resetPassword(token: string, password: string): Observable<any> {
    // Match tests expecting token in path
    return this.http.post(`${this.apiUrl}/auth/reset-password/${token}`, { password });
  }

  verifyEmail(token: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/auth/verify-email/${token}`);
  }

  getUserRole(): string | null {
    const user = this.getCurrentUser();
    return user?.role || null;
  }

  getCurrentUser(): User | null {
    const stored = localStorage.getItem('currentUser');
    if (stored) {
      try {
        const user = JSON.parse(stored);
        // Normalize role when retrieving from storage
        return normalizeUserRole(user);
      } catch {
        return null;
      }
    }
    const user = this.currentUserValue;
    return user ? normalizeUserRole(user) : null;
  }
}
