import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { PaymentService } from './payment.service';
import { environment } from '../../../environments/environment';

describe('PaymentService', () => {
  let service: PaymentService;
  let httpMock: HttpTestingController;
  const base = `${environment.apiUrl}/payments`;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [PaymentService]
    });
    service = TestBed.inject(PaymentService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should process payment', () => {
    const body = { bookingId: 'b1', amount: 100, currency: 'MAD' };
    service.processPayment(body).subscribe();
    const req = httpMock.expectOne(`${base}/process`);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(body);
    req.flush({ success: true });
  });

  it('should create payment intent', () => {
    service.createPaymentIntent('b2').subscribe();
    const req = httpMock.expectOne(`${base}/intent`);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual({ bookingId: 'b2' });
    req.flush({ clientSecret: 'sec' });
  });

  it('should release escrow', () => {
    service.releaseEscrow('b3').subscribe();
    const req = httpMock.expectOne(`${base}/release-escrow`);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual({ bookingId: 'b3' });
    req.flush({ success: true });
  });

  it('should refund with amount', () => {
    service.refund('b4', 50).subscribe();
    const req = httpMock.expectOne(`${base}/refund`);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual({ bookingId: 'b4', amount: 50 });
    req.flush({ success: true });
  });

  it('should refund without amount', () => {
    service.refund('b5').subscribe();
    const req = httpMock.expectOne(`${base}/refund`);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual({ bookingId: 'b5', amount: undefined });
    req.flush({ success: true });
  });

  it('should get payment history', () => {
    service.getPaymentHistory().subscribe();
    const req = httpMock.expectOne(`${base}/history`);
    expect(req.request.method).toBe('GET');
    req.flush([]);
  });

  it('should get payment by id', () => {
    service.getPaymentById('p1').subscribe();
    const req = httpMock.expectOne(`${base}/p1`);
    expect(req.request.method).toBe('GET');
    req.flush({});
  });
});
