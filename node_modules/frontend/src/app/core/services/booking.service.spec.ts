import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { BookingService } from './booking.service';
import { environment } from '../../../environments/environment';

describe('BookingService', () => {
  let service: BookingService;
  let httpMock: HttpTestingController;
  const apiUrl = environment.apiUrl;

  const mockBooking = {
    _id: '123',
    service: {
      _id: 'service-123',
      title: 'Test Service',
      pricing: { amount: 100 }
    },
    user: {
      _id: 'user-123',
      email: 'test@example.com'
    },
    startDate: new Date('2025-01-01'),
    endDate: new Date('2025-01-05'),
    guests: 2,
    totalPrice: 400,
    status: 'pending' as const,
    paymentStatus: 'pending' as const,
    createdAt: new Date(),
    updatedAt: new Date()
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [BookingService]
    });
    service = TestBed.inject(BookingService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('createBooking', () => {
    it('should create a new booking', (done) => {
      const bookingData = {
        service: 'service-123',
        startDate: new Date('2025-01-01'),
        endDate: new Date('2025-01-05'),
        guests: 2
      };

      const mockResponse = {
        success: true,
        message: 'Booking created successfully',
        data: mockBooking
      };

      service.createBooking(bookingData).subscribe({
        next: (response) => {
          expect(response.success).toBe(true);
          expect(response.data._id).toBe('123');
          done();
        }
      });

      const req = httpMock.expectOne(`${apiUrl}/bookings`);
      expect(req.request.method).toBe('POST');
      req.flush(mockResponse);
    });
  });

  describe('getBookings', () => {
    it('should retrieve all bookings', (done) => {
      const mockResponse = {
        success: true,
        data: {
          bookings: [mockBooking],
          pagination: {
            total: 1,
            page: 1,
            limit: 10,
            pages: 1
          }
        }
      };

      service.getBookings().subscribe({
        next: (response) => {
          expect(response.success).toBe(true);
          expect(response.data.bookings.length).toBe(1);
          done();
        }
      });

      const req = httpMock.expectOne(`${apiUrl}/bookings`);
      expect(req.request.method).toBe('GET');
      req.flush(mockResponse);
    });

    it('should retrieve bookings with filters', (done) => {
      const filters = { status: 'confirmed', limit: 20 };
      const mockResponse = {
        success: true,
        data: {
          bookings: [mockBooking],
          pagination: {
            total: 1,
            page: 1,
            limit: 20,
            pages: 1
          }
        }
      };

      service.getBookings(filters).subscribe({
        next: (response) => {
          expect(response.success).toBe(true);
          done();
        }
      });

      const req = httpMock.expectOne((request) => {
        return request.url === `${apiUrl}/bookings` &&
               request.params.get('status') === 'confirmed' &&
               request.params.get('limit') === '20';
      });
      expect(req.request.method).toBe('GET');
      req.flush(mockResponse);
    });
  });

  describe('getBookingById', () => {
    it('should retrieve a booking by id', (done) => {
      const bookingId = '123';
      const mockResponse = {
        success: true,
        data: mockBooking
      };

      service.getBookingById(bookingId).subscribe({
        next: (response) => {
          expect(response.success).toBe(true);
          expect(response.data._id).toBe(bookingId);
          done();
        }
      });

      const req = httpMock.expectOne(`${apiUrl}/bookings/${bookingId}`);
      expect(req.request.method).toBe('GET');
      req.flush(mockResponse);
    });
  });

  describe('cancelBooking', () => {
    it('should cancel a booking with reason', (done) => {
      const bookingId = '123';
      const reason = 'Change of plans';
      const mockResponse = {
        success: true,
        message: 'Booking cancelled successfully',
        data: { ...mockBooking, status: 'cancelled' as const }
      };

      service.cancelBooking(bookingId, reason).subscribe({
        next: (response) => {
          expect(response.success).toBe(true);
          expect(response.data.status).toBe('cancelled');
          done();
        }
      });

      const req = httpMock.expectOne(`${apiUrl}/bookings/${bookingId}/cancel`);
      expect(req.request.method).toBe('POST');
      expect(req.request.body).toEqual({ reason });
      req.flush(mockResponse);
    });
  });

  describe('confirmBooking', () => {
    it('should confirm a booking', (done) => {
      const bookingId = '123';
      const mockResponse = {
        success: true,
        message: 'Booking confirmed successfully',
        data: { ...mockBooking, status: 'confirmed' as const }
      };

      service.confirmBooking(bookingId).subscribe({
        next: (response) => {
          expect(response.success).toBe(true);
          expect(response.data.status).toBe('confirmed');
          done();
        }
      });

      const req = httpMock.expectOne(`${apiUrl}/bookings/${bookingId}/confirm`);
      expect(req.request.method).toBe('POST');
      req.flush(mockResponse);
    });
  });

  describe('completeBooking', () => {
    it('should complete a booking', (done) => {
      const bookingId = '123';
      const mockResponse = {
        success: true,
        message: 'Booking completed successfully',
        data: { ...mockBooking, status: 'completed' as const }
      };

      service.completeBooking(bookingId).subscribe({
        next: (response) => {
          expect(response.success).toBe(true);
          expect(response.data.status).toBe('completed');
          done();
        }
      });

      const req = httpMock.expectOne(`${apiUrl}/bookings/${bookingId}/complete`);
      expect(req.request.method).toBe('POST');
      req.flush(mockResponse);
    });
  });

  describe('Error Handling', () => {
    it('should handle create booking error', (done) => {
      const bookingData = {
        service: 'service-123',
        startDate: new Date('2025-01-01'),
        endDate: new Date('2025-01-05'),
        guests: 2
      };

      service.createBooking(bookingData).subscribe({
        error: (error) => {
          expect(error.status).toBe(400);
          done();
        }
      });

      const req = httpMock.expectOne(`${apiUrl}/bookings`);
      req.flush({ message: 'Invalid booking data' }, { status: 400, statusText: 'Bad Request' });
    });

    it('should handle not found error', (done) => {
      const bookingId = 'nonexistent';

      service.getBookingById(bookingId).subscribe({
        error: (error) => {
          expect(error.status).toBe(404);
          done();
        }
      });

      const req = httpMock.expectOne(`${apiUrl}/bookings/${bookingId}`);
      req.flush({ message: 'Booking not found' }, { status: 404, statusText: 'Not Found' });
    });
  });
});
