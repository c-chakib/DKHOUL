import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NavbarComponent } from './navbar.component';
import { AuthService } from '../../../core/services/auth.service';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { BehaviorSubject, of } from 'rxjs';

class MockAuthService {
  currentUser = new BehaviorSubject<any>(null);
  logout = jasmine.createSpy('logout');
}

describe('NavbarComponent', () => {
  let component: NavbarComponent;
  let fixture: ComponentFixture<NavbarComponent>;
  let authService: MockAuthService;
  let router: Router;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NavbarComponent, RouterTestingModule],
      providers: [
        { provide: AuthService, useClass: MockAuthService }
      ]
    }).compileComponents();

    authService = TestBed.inject(AuthService) as unknown as MockAuthService;
    router = TestBed.inject(Router);
    spyOn(router, 'navigate').and.returnValue(Promise.resolve(true));

    fixture = TestBed.createComponent(NavbarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should show login/register when logged out', () => {
    authService.currentUser.next(null);
    fixture.detectChanges();
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.textContent).toContain('Login');
    expect(compiled.textContent).toContain('S\'inscrire');
  });

  it('should show dashboard links when logged in', () => {
    authService.currentUser.next({ _id: '1', role: 'tourist', firstName: 'A', lastName: 'B', email: 'a@b.com' });
    fixture.detectChanges();
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.textContent).toContain('Dashboard');
    // Messages icon button should be visible
    const messagesButton = compiled.querySelector('button[mat-icon-button] mat-icon');
    expect(messagesButton).toBeTruthy();
  });

  it('should display provider badge when role is provider', () => {
    authService.currentUser.next({ role: 'provider' });
    fixture.detectChanges();
    expect(component.isProvider()).toBeTrue();
  });

  it('should display admin badge when role is admin', () => {
    authService.currentUser.next({ role: 'admin' });
    fixture.detectChanges();
    expect(component.isAdmin()).toBeTrue();
  });

  it('should navigate to home on navigateToHome()', () => {
    component.navigateToHome();
    expect(router.navigate).toHaveBeenCalledWith(['/home']);
  });

  it('should call authService.logout on logout()', () => {
    component.logout();
    expect(authService.logout).toHaveBeenCalled();
    expect(router.navigate).toHaveBeenCalledWith(['/home']);
  });
});
