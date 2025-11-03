import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from './api.service';
import { Service, ServiceFilter } from '../../models/service';

@Injectable({
  providedIn: 'root'
})
export class ServiceService {

  constructor(private apiService: ApiService) { }

  getServices(filter?: ServiceFilter): Observable<any> {
    return this.apiService.get<Service[]>('services', filter);
  }

  getServiceById(id: string): Observable<any> {
    return this.apiService.get<Service>(`services/${id}`);
  }

  createService(serviceData: Partial<Service>): Observable<any> {
    return this.apiService.post<Service>('services', serviceData);
  }

  updateService(id: string, serviceData: Partial<Service>): Observable<any> {
    return this.apiService.put<Service>(`services/${id}`, serviceData);
  }

  deleteService(id: string): Observable<any> {
    return this.apiService.delete(`services/${id}`);
  }

  uploadServiceImages(id: string, images: File[]): Observable<any> {
    const formData = new FormData();
    images.forEach(image => formData.append('images', image));
    return this.apiService.upload(`services/${id}/images`, formData);
  }

  searchServices(query: string, filters?: any): Observable<any> {
    return this.apiService.get<Service[]>('services/search', { search: query, ...filters });
  }

  getFeaturedServices(): Observable<any> {
    return this.apiService.get<Service[]>('services/featured');
  }

  getHostServices(hostId: string): Observable<any> {
    return this.apiService.get<Service[]>(`services/host/${hostId}`);
  }

  getMyServices(): Observable<any> {
    return this.apiService.get<Service[]>('services/my');
  }
}

