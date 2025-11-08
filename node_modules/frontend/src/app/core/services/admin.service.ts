import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from './api.service';

@Injectable({
  providedIn: 'root'
})
export class AdminService {

  constructor(private apiService: ApiService) { }

  // User Management
  getAllUsers(params?: any): Observable<any> {
    return this.apiService.get('admin/users', params);
  }

  getUserById(id: string): Observable<any> {
    return this.apiService.get(`admin/users/${id}`);
  }

  updateUser(id: string, data: any): Observable<any> {
    return this.apiService.put(`admin/users/${id}`, data);
  }

  deleteUser(id: string): Observable<any> {
    return this.apiService.delete(`admin/users/${id}`);
  }

  verifyUser(id: string): Observable<any> {
    return this.apiService.post(`admin/users/${id}/verify`, {});
  }

  // Service Management
  getAllServices(params?: any): Observable<any> {
    return this.apiService.get('admin/services', params);
  }

  approveService(id: string): Observable<any> {
    return this.apiService.post(`admin/services/${id}/approve`, {});
  }

  rejectService(id: string, reason: string): Observable<any> {
    return this.apiService.post(`admin/services/${id}/reject`, { reason });
  }

  // Booking Management
  getAllBookings(params?: any): Observable<any> {
    return this.apiService.get('admin/bookings', params);
  }

  getUsers(page?: number, limit?: number, search?: string): Observable<any> {
    return this.apiService.get('admin/users', { page, limit, search });
  }

  suspendUser(userId: string): Observable<any> {
    return this.apiService.post(`admin/users/${userId}/suspend`, {});
  }

  // Analytics & Reports
  getDashboardStats(): Observable<any> {
    return this.apiService.get('admin/stats/dashboard');
  }

  getRevenueStats(period: string): Observable<any> {
    return this.apiService.get(`admin/stats/revenue`, { period });
  }

  getUserGrowthStats(): Observable<any> {
    return this.apiService.get('admin/stats/user-growth');
  }

  // Reports
  generateReport(type: string, params: any): Observable<any> {
    return this.apiService.post(`admin/reports/${type}`, params);
  }
}

