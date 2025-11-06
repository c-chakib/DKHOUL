import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { UserService } from './user.service';

describe('UserService', () => {
  let service: UserService;
  let httpMock: HttpTestingController;
  const apiUrl = 'http://localhost:5000/api/users';

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [UserService]
    });
    service = TestBed.inject(UserService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('getUserProfile', () => {
    it('should get current user profile when no userId provided', () => {
      const mockUser = { _id: '123', email: 'test@test.com', role: 'tourist' as const };
      const mockResponse = { success: true, data: mockUser };

      service.getUserProfile().subscribe(response => {
        expect(response.success).toBe(true);
        expect(response.data._id).toBe('123');
      });

      const req = httpMock.expectOne(`${apiUrl}/profile`);
      expect(req.request.method).toBe('GET');
      req.flush(mockResponse);
    });

    it('should get specific user profile when userId provided', () => {
      const mockUser = { _id: '456', email: 'other@test.com', role: 'provider' as const };
      const mockResponse = { success: true, data: mockUser };

      service.getUserProfile('456').subscribe(response => {
        expect(response.data._id).toBe('456');
      });

      const req = httpMock.expectOne(`${apiUrl}/456`);
      expect(req.request.method).toBe('GET');
      req.flush(mockResponse);
    });
  });

  describe('updateProfile', () => {
    it('should update user profile', () => {
      const updateData = { profile: { firstName: 'John', lastName: 'Doe' } };
      const mockResponse = { success: true, data: { _id: '123', ...updateData } };

      service.updateProfile(updateData).subscribe(response => {
        expect(response.success).toBe(true);
      });

      const req = httpMock.expectOne(`${apiUrl}/profile`);
      expect(req.request.method).toBe('PUT');
      expect(req.request.body).toEqual(updateData);
      req.flush(mockResponse);
    });
  });

  describe('uploadAvatar', () => {
    it('should upload avatar file', () => {
      const file = new File(['dummy content'], 'avatar.jpg', { type: 'image/jpeg' });
      const mockResponse = { success: true, data: { url: 'http://example.com/avatar.jpg' } };

      service.uploadAvatar(file).subscribe(response => {
        expect(response.success).toBe(true);
        expect(response.data.url).toContain('avatar.jpg');
      });

      const req = httpMock.expectOne(`${apiUrl}/avatar`);
      expect(req.request.method).toBe('POST');
      expect(req.request.body instanceof FormData).toBe(true);
      req.flush(mockResponse);
    });
  });

  describe('changePassword', () => {
    it('should change password', () => {
      const mockResponse = { success: true };

      service.changePassword('oldPass123', 'newPass456').subscribe(response => {
        expect(response.success).toBe(true);
      });

      const req = httpMock.expectOne(`${apiUrl}/change-password`);
      expect(req.request.method).toBe('PUT');
      expect(req.request.body).toEqual({
        currentPassword: 'oldPass123',
        newPassword: 'newPass456'
      });
      req.flush(mockResponse);
    });
  });

  describe('deleteAccount', () => {
    it('should delete user account', () => {
      const mockResponse = { success: true };

      service.deleteAccount().subscribe(response => {
        expect(response.success).toBe(true);
      });

      const req = httpMock.expectOne(`${apiUrl}/account`);
      expect(req.request.method).toBe('DELETE');
      req.flush(mockResponse);
    });
  });

  describe('getUserServices', () => {
    it('should get services for a user', () => {
      const mockServices = [{ _id: '1', title: 'Service 1' }, { _id: '2', title: 'Service 2' }];
      const mockResponse = { success: true, data: mockServices };

      service.getUserServices('123').subscribe(response => {
        expect(response.data.length).toBe(2);
      });

      const req = httpMock.expectOne(`${apiUrl}/123/services`);
      expect(req.request.method).toBe('GET');
      req.flush(mockResponse);
    });
  });

  describe('getUserBookings', () => {
    it('should get bookings for a user', () => {
      const mockBookings = [{ _id: '1' }, { _id: '2' }];
      const mockResponse = { success: true, data: mockBookings };

      service.getUserBookings('123').subscribe(response => {
        expect(response.data.length).toBe(2);
      });

      const req = httpMock.expectOne(`${apiUrl}/123/bookings`);
      expect(req.request.method).toBe('GET');
      req.flush(mockResponse);
    });
  });

  describe('getUserReviews', () => {
    it('should get reviews for a user', () => {
      const mockReviews = [{ _id: '1', rating: 5 }];
      const mockResponse = { success: true, data: mockReviews };

      service.getUserReviews('123').subscribe(response => {
        expect(response.data.length).toBe(1);
      });

      const req = httpMock.expectOne(`${apiUrl}/123/reviews`);
      expect(req.request.method).toBe('GET');
      req.flush(mockResponse);
    });
  });

  describe('getProfile', () => {
    it('should get current user profile', () => {
      const mockUser = { _id: '123', email: 'test@test.com', role: 'tourist' as const };
      const mockResponse = { success: true, data: mockUser };

      service.getProfile().subscribe(response => {
        expect(response.success).toBe(true);
        expect(response.data._id).toBe('123');
      });

      const req = httpMock.expectOne(`${apiUrl}/profile`);
      expect(req.request.method).toBe('GET');
      req.flush(mockResponse);
    });
  });
});
