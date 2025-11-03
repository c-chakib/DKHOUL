import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class UploadService {
  private apiUrl = `${environment.apiUrl}/upload`;

  constructor(private http: HttpClient) {}

  uploadImage(file: File, folder: string = 'general'): Observable<string> {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('folder', folder);

    return this.http.post<{ url: string }>(`${this.apiUrl}/image`, formData).pipe(
      map(response => response.url)
    );
  }

  uploadMultipleImages(files: File[], folder: string = 'general'): Observable<string[]> {
    const formData = new FormData();
    files.forEach(file => {
      formData.append('files', file);
    });
    formData.append('folder', folder);

    return this.http.post<{ urls: string[] }>(`${this.apiUrl}/multiple`, formData).pipe(
      map(response => response.urls)
    );
  }

  deleteImage(url: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/image`, {
      body: { url }
    });
  }
}
