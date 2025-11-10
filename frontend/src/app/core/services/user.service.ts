import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { User } from '../../models/user';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private apiUrl = `${environment.apiUrl}/users`;

  constructor(private http: HttpClient) {}

  getUserProfile(userId?: string): Observable<{ success: boolean; data: User }> {
    const url = userId ? `${this.apiUrl}/${userId}` : `${this.apiUrl}/profile`;
    return this.http.get<{ success: boolean; data: User }>(url);
  }

  updateProfile(data: Partial<User>): Observable<{ success: boolean; data: User }> {
    return this.http.put<{ success: boolean; data: User }>(`${this.apiUrl}/profile`, data);
  }

  uploadAvatar(file: File): Observable<{ success: boolean; data: { url: string } }> {
    const formData = new FormData();
    formData.append('avatar', file);
    return this.http.post<{ success: boolean; data: { url: string } }>(`${this.apiUrl}/avatar`, formData);
  }

  changePassword(currentPassword: string, newPassword: string): Observable<{ success: boolean }> {
    return this.http.put<{ success: boolean }>(`${this.apiUrl}/change-password`, {
      currentPassword,
      newPassword
    });
  }

  deleteAccount(): Observable<{ success: boolean }> {
    return this.http.delete<{ success: boolean }>(`${this.apiUrl}/account`);
  }

  getUserServices(userId: string): Observable<{ success: boolean; data: any[] }> {
    return this.http.get<{ success: boolean; data: any[] }>(`${this.apiUrl}/${userId}/services`);
  }

  getUserBookings(userId: string): Observable<{ success: boolean; data: any[] }> {
    return this.http.get<{ success: boolean; data: any[] }>(`${this.apiUrl}/${userId}/bookings`);
  }

  getUserReviews(userId: string): Observable<{ success: boolean; data: any[] }> {
    return this.http.get<{ success: boolean; data: any[] }>(`${this.apiUrl}/${userId}/reviews`);
  }

  getProfile(): Observable<{ success: boolean; data: User }> {
    return this.http.get<{ success: boolean; data: User }>(`${this.apiUrl}/profile`);
  }

  getAllUsers(limit?: number): Observable<{ success: boolean; data: User[] }> {
    const params = limit ? { limit: limit.toString() } : {};
    return this.http.get<{ success: boolean; data: User[] }>(this.apiUrl, { params });
  }
}
