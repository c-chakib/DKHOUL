import { TestBed } from '@angular/core/testing';
import { ServiceService } from './service.service';
import { ApiService } from './api.service';
import { of } from 'rxjs';

describe('ServiceService', () => {
  let service: ServiceService;
  let apiServiceSpy: jasmine.SpyObj<ApiService>;

  beforeEach(() => {
    const spy = jasmine.createSpyObj('ApiService', ['get', 'post', 'put', 'delete', 'upload']);

    TestBed.configureTestingModule({
      providers: [
        ServiceService,
        { provide: ApiService, useValue: spy }
      ]
    });

    service = TestBed.inject(ServiceService);
    apiServiceSpy = TestBed.inject(ApiService) as jasmine.SpyObj<ApiService>;
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('getServices', () => {
    it('should get all services', () => {
      const mockResponse = { success: true, data: [{ _id: '1', title: 'Test Service' }] };
      apiServiceSpy.get.and.returnValue(of(mockResponse));

      service.getServices().subscribe(response => {
        expect(response.success).toBe(true);
        expect((response.data as any).length).toBe(1);
      });

      expect(apiServiceSpy.get).toHaveBeenCalledWith('services', undefined);
    });

    it('should get services with filter', () => {
      const filter = { category: 'adventure', city: 'Marrakech' };
      const mockResponse = { success: true, data: [] };
      apiServiceSpy.get.and.returnValue(of(mockResponse));

      service.getServices(filter).subscribe();

      expect(apiServiceSpy.get).toHaveBeenCalledWith('services', filter);
    });
  });

  describe('getServiceById', () => {
    it('should get service by id', () => {
      const mockResponse = { success: true, data: { _id: '123', title: 'Test Service' } };
      apiServiceSpy.get.and.returnValue(of(mockResponse));

      service.getServiceById('123').subscribe(response => {
        expect(response.success).toBe(true);
      });

      expect(apiServiceSpy.get).toHaveBeenCalledWith('services/123');
    });
  });

  describe('createService', () => {
    it('should create a new service', () => {
      const newService = { title: 'New Service', description: 'Test description' };
      const mockResponse = { success: true, data: { _id: '123', ...newService } };
      apiServiceSpy.post.and.returnValue(of(mockResponse));

      service.createService(newService).subscribe(response => {
        expect(response.success).toBe(true);
      });

      expect(apiServiceSpy.post).toHaveBeenCalledWith('services', newService);
    });
  });

  describe('updateService', () => {
    it('should update a service', () => {
      const updateData = { title: 'Updated Service' };
      const mockResponse = { success: true, data: { _id: '123', ...updateData } };
      apiServiceSpy.put.and.returnValue(of(mockResponse));

      service.updateService('123', updateData).subscribe(response => {
        expect(response.success).toBe(true);
      });

      expect(apiServiceSpy.put).toHaveBeenCalledWith('services/123', updateData);
    });
  });

  describe('deleteService', () => {
    it('should delete a service', () => {
      const mockResponse = { success: true, data: null, message: 'Service deleted' };
      apiServiceSpy.delete.and.returnValue(of(mockResponse));

      service.deleteService('123').subscribe(response => {
        expect(response.success).toBe(true);
      });

      expect(apiServiceSpy.delete).toHaveBeenCalledWith('services/123');
    });
  });

  describe('uploadServiceImages', () => {
    it('should upload service images', () => {
      const files = [
        new File([''], 'image1.jpg', { type: 'image/jpeg' }),
        new File([''], 'image2.jpg', { type: 'image/jpeg' })
      ];
      const mockResponse = { success: true, data: { urls: ['url1', 'url2'] } };
      apiServiceSpy.upload.and.returnValue(of(mockResponse));

      service.uploadServiceImages('123', files).subscribe(response => {
        expect(response.success).toBe(true);
      });

      expect(apiServiceSpy.upload).toHaveBeenCalledWith('services/123/images', jasmine.any(FormData));
    });
  });

  describe('searchServices', () => {
    it('should search services with query', () => {
      const mockResponse = { success: true, data: [] };
      apiServiceSpy.get.and.returnValue(of(mockResponse));

      service.searchServices('desert').subscribe();

      expect(apiServiceSpy.get).toHaveBeenCalledWith('services/search', { search: 'desert' });
    });

    it('should search services with query and additional filters', () => {
      const filters = { category: 'adventure', minPrice: 100 };
      const mockResponse = { success: true, data: [] };
      apiServiceSpy.get.and.returnValue(of(mockResponse));

      service.searchServices('desert', filters).subscribe();

      expect(apiServiceSpy.get).toHaveBeenCalledWith('services/search', { search: 'desert', ...filters });
    });
  });

  describe('getFeaturedServices', () => {
    it('should get featured services', () => {
      const mockResponse = { success: true, data: [{ _id: '1', featured: true }] };
      apiServiceSpy.get.and.returnValue(of(mockResponse));

      service.getFeaturedServices().subscribe(response => {
        expect(response.success).toBe(true);
      });

      expect(apiServiceSpy.get).toHaveBeenCalledWith('services/featured');
    });
  });

  describe('getHostServices', () => {
    it('should get services by host', () => {
      const mockResponse = { success: true, data: [] };
      apiServiceSpy.get.and.returnValue(of(mockResponse));

      service.getHostServices('host123').subscribe();

      expect(apiServiceSpy.get).toHaveBeenCalledWith('services/host/host123');
    });
  });

  describe('getMyServices', () => {
    it('should get current user services', () => {
      const mockResponse = { success: true, data: [] };
      apiServiceSpy.get.and.returnValue(of(mockResponse));

      service.getMyServices().subscribe();

      expect(apiServiceSpy.get).toHaveBeenCalledWith('services/my');
    });
  });
});
