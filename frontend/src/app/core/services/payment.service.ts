import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class PaymentService {
  private apiUrl = `${environment.apiUrl}/payments`;

  constructor(private http: HttpClient) {}

  processPayment(data: { bookingId: string; amount: number; currency: string }): Observable<any> {
    return this.http.post(`${this.apiUrl}/process`, data);
  }

  createPaymentIntent(bookingId: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/intent`, { bookingId });
  }

  releaseEscrow(bookingId: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/release-escrow`, { bookingId });
  }

  refund(bookingId: string, amount?: number): Observable<any> {
    return this.http.post(`${this.apiUrl}/refund`, { bookingId, amount });
  }

  getPaymentHistory(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/history`);
  }

  getPaymentById(id: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/${id}`);
  }
}
