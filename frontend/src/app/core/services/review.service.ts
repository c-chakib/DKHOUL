import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Review {
  _id: string;
  serviceId: string;
  userId: string;
  bookingId: string;
  ratings: {
    overall: number;
    communication: number;
    service: number;
    value: number;
    cleanliness: number;
  };
  comment: string;
  response?: string;
  createdAt: string;
}

@Injectable({
  providedIn: 'root'
})
export class ReviewService {
  private apiUrl = 'http://localhost:5000/api/reviews';

  constructor(private http: HttpClient) {}

  createReview(reviewData: Partial<Review>): Observable<{ success: boolean; data: Review }> {
    return this.http.post<{ success: boolean; data: Review }>(this.apiUrl, reviewData);
  }

  getServiceReviews(serviceId: string): Observable<{ success: boolean; data: Review[] }> {
    return this.http.get<{ success: boolean; data: Review[] }>(`${this.apiUrl}/service/${serviceId}`);
  }

  getUserReviews(userId: string): Observable<{ success: boolean; data: Review[] }> {
    return this.http.get<{ success: boolean; data: Review[] }>(`${this.apiUrl}/user/${userId}`);
  }

  updateReview(reviewId: string, data: Partial<Review>): Observable<{ success: boolean; data: Review }> {
    return this.http.put<{ success: boolean; data: Review }>(`${this.apiUrl}/${reviewId}`, data);
  }

  deleteReview(reviewId: string): Observable<{ success: boolean }> {
    return this.http.delete<{ success: boolean }>(`${this.apiUrl}/${reviewId}`);
  }

  respondToReview(reviewId: string, response: string): Observable<{ success: boolean; data: Review }> {
    return this.http.put<{ success: boolean; data: Review }>(`${this.apiUrl}/${reviewId}/respond`, {
      response
    });
  }
}
