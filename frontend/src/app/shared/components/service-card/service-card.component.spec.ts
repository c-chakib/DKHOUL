import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ServiceCardComponent } from './service-card.component';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';

describe('ServiceCardComponent', () => {
  let component: ServiceCardComponent;
  let fixture: ComponentFixture<ServiceCardComponent>;
  let router: Router;

  const mockService = {
    _id: 'svc123',
    title: 'Desert Tour',
    category: 'skills',
    rating: { average: 4.3 },
    pricing: { amount: 250 }
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ServiceCardComponent, RouterTestingModule]
    }).compileComponents();

    router = TestBed.inject(Router);
    spyOn(router, 'navigate').and.returnValue(Promise.resolve(true));

    fixture = TestBed.createComponent(ServiceCardComponent);
    component = fixture.componentInstance;
    component.service = mockService;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should navigate to service detail on viewService()', () => {
    component.viewService();
    expect(router.navigate).toHaveBeenCalledWith(['/services', mockService._id]);
  });

  it('should compute rating stars', () => {
    const stars = component.getRatingStars(4.2);
    expect(stars.length).toBe(4);
  });

  it('should default rating stars to 0 when invalid', () => {
    const stars = component.getRatingStars(undefined as unknown as number);
    expect(stars.length).toBe(0);
  });

  it('should map category to color', () => {
    expect(component.getCategoryColor('skills')).toBeDefined();
  });

  it('should fallback to default color for unknown category', () => {
    expect(component.getCategoryColor('unknown')).toBe('#667eea');
  });
});
