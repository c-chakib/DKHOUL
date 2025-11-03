import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from './api.service';
import { Booking } from '../../models/booking';

@Injectable({
  providedIn: 'root'
})
export class BookingService {

  constructor(private apiService: ApiService) { }

  createBooking(bookingData: Partial<Booking>): Observable<any> {
    return this.apiService.post<Booking>('bookings', bookingData);
  }

  getBookings(params?: any): Observable<any> {
    return this.apiService.get<Booking[]>('bookings', params);
  }

  getBookingById(id: string): Observable<any> {
    return this.apiService.get<Booking>(`bookings/${id}`);
  }

  getTouristBookings(): Observable<any> {
    return this.apiService.get<Booking[]>('bookings/tourist');
  }

  getHostBookings(): Observable<any> {
    return this.apiService.get<Booking[]>('bookings/host');
  }

  updateBookingStatus(id: string, status: string): Observable<any> {
    return this.apiService.patch<Booking>(`bookings/${id}/status`, { status });
  }

  cancelBooking(id: string, reason: string): Observable<any> {
    return this.apiService.post<Booking>(`bookings/${id}/cancel`, { reason });
  }

  confirmBooking(id: string): Observable<any> {
    return this.apiService.post<Booking>(`bookings/${id}/confirm`, {});
  }

  completeBooking(id: string): Observable<any> {
    return this.apiService.post<Booking>(`bookings/${id}/complete`, {});
  }

  getBookingStats(): Observable<any> {
    return this.apiService.get('bookings/stats');
  }

  getMyBookings(): Observable<any> {
    return this.apiService.get<Booking[]>('bookings/my');
  }
}

