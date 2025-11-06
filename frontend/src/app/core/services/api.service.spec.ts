import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { ApiService } from './api.service';
import { environment } from '../../../environments/environment';

describe('ApiService', () => {
  let service: ApiService;
  let httpMock: HttpTestingController;
  const apiUrl = environment.apiUrl;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [ApiService]
    });
    service = TestBed.inject(ApiService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('GET requests', () => {
    it('should perform GET request without params', () => {
      const mockResponse = { success: true, data: { id: 1, name: 'Test' } };

      service.get('services').subscribe(response => {
        expect(response).toEqual(mockResponse);
        expect(response.success).toBe(true);
        expect((response.data as any).id).toBe(1);
      });

      const req = httpMock.expectOne(`${apiUrl}/services`);
      expect(req.request.method).toBe('GET');
      req.flush(mockResponse);
    });

    it('should perform GET request with params', () => {
      const mockResponse = { success: true, data: [] };
      const params = { page: 1, limit: 10, search: 'test' };

      service.get('services', params).subscribe(response => {
        expect(response).toEqual(mockResponse);
      });

      const req = httpMock.expectOne(request => 
        request.url === `${apiUrl}/services` &&
        request.params.get('page') === '1' &&
        request.params.get('limit') === '10' &&
        request.params.get('search') === 'test'
      );
      expect(req.request.method).toBe('GET');
      req.flush(mockResponse);
    });

    it('should skip null and undefined params', () => {
      const params = { page: 1, search: null, filter: undefined };

      service.get('services', params).subscribe();

      const req = httpMock.expectOne(request => 
        request.url === `${apiUrl}/services` &&
        request.params.has('page') &&
        !request.params.has('search') &&
        !request.params.has('filter')
      );
      req.flush({ success: true, data: [] });
    });
  });

  describe('POST requests', () => {
    it('should perform POST request', () => {
      const mockData = { name: 'Test Service', price: 100 };
      const mockResponse = { success: true, data: { id: 1, ...mockData } };

      service.post('services', mockData).subscribe(response => {
        expect(response.success).toBe(true);
        expect((response.data as any).name).toBe(mockData.name);
      });

      const req = httpMock.expectOne(`${apiUrl}/services`);
      expect(req.request.method).toBe('POST');
      expect(req.request.body).toEqual(mockData);
      req.flush(mockResponse);
    });
  });

  describe('PUT requests', () => {
    it('should perform PUT request', () => {
      const mockData = { name: 'Updated Service' };
      const mockResponse = { success: true, data: { id: 1, ...mockData } };

      service.put('services/1', mockData).subscribe(response => {
        expect(response.success).toBe(true);
        expect((response.data as any).name).toBe(mockData.name);
      });

      const req = httpMock.expectOne(`${apiUrl}/services/1`);
      expect(req.request.method).toBe('PUT');
      expect(req.request.body).toEqual(mockData);
      req.flush(mockResponse);
    });
  });

  describe('PATCH requests', () => {
    it('should perform PATCH request', () => {
      const mockData = { status: 'confirmed' };
      const mockResponse = { success: true, data: { id: 1, ...mockData } };

      service.patch('bookings/1', mockData).subscribe(response => {
        expect(response.success).toBe(true);
        expect((response.data as any).status).toBe(mockData.status);
      });

      const req = httpMock.expectOne(`${apiUrl}/bookings/1`);
      expect(req.request.method).toBe('PATCH');
      expect(req.request.body).toEqual(mockData);
      req.flush(mockResponse);
    });
  });

  describe('DELETE requests', () => {
    it('should perform DELETE request', () => {
      const mockResponse = { success: true, message: 'Deleted successfully' };

      service.delete('services/1').subscribe(response => {
        expect(response.success).toBe(true);
        expect(response.message).toBe('Deleted successfully');
      });

      const req = httpMock.expectOne(`${apiUrl}/services/1`);
      expect(req.request.method).toBe('DELETE');
      req.flush(mockResponse);
    });
  });

  describe('UPLOAD requests', () => {
    it('should perform upload request with FormData', () => {
      const formData = new FormData();
      formData.append('file', new Blob(['test']), 'test.jpg');
      const mockResponse = { success: true, data: { url: 'http://example.com/test.jpg' } };

      service.upload('upload/photo', formData).subscribe(response => {
        expect(response.success).toBe(true);
        expect((response.data as any).url).toBeTruthy();
      });

      const req = httpMock.expectOne(`${apiUrl}/upload/photo`);
      expect(req.request.method).toBe('POST');
      expect(req.request.body).toEqual(formData);
      req.flush(mockResponse);
    });
  });

  describe('Error handling', () => {
    it('should handle HTTP errors', () => {
      service.get('services').subscribe({
        next: () => fail('should have failed'),
        error: (error) => {
          expect(error.status).toBe(500);
          expect(error.statusText).toBe('Server Error');
        }
      });

      const req = httpMock.expectOne(`${apiUrl}/services`);
      req.flush('Server error', { status: 500, statusText: 'Server Error' });
    });
  });

  describe('Response with pagination', () => {
    it('should handle paginated responses', () => {
      const mockResponse = {
        success: true,
        data: [{ id: 1 }, { id: 2 }],
        pagination: {
          page: 1,
          limit: 10,
          total: 50,
          pages: 5
        }
      };

      service.get('services', { page: 1, limit: 10 }).subscribe(response => {
        expect(response.pagination).toBeTruthy();
        expect(response.pagination?.page).toBe(1);
        expect(response.pagination?.total).toBe(50);
      });

      const req = httpMock.expectOne(request => request.url.includes('/services'));
      req.flush(mockResponse);
    });
  });
});
