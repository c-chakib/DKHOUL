import { TestBed } from '@angular/core/testing';
import { MatSnackBar, MatSnackBarConfig } from '@angular/material/snack-bar';
import { ToastService } from './toast.service';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

describe('ToastService', () => {
  let service: ToastService;
  let snackBar: jasmine.SpyObj<MatSnackBar>;

  beforeEach(() => {
    const snackBarSpy = jasmine.createSpyObj('MatSnackBar', ['open', 'dismiss']);

    TestBed.configureTestingModule({
      imports: [BrowserAnimationsModule],
      providers: [
        ToastService,
        { provide: MatSnackBar, useValue: snackBarSpy }
      ]
    });

    service = TestBed.inject(ToastService);
    snackBar = TestBed.inject(MatSnackBar) as jasmine.SpyObj<MatSnackBar>;
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('success()', () => {
    it('should show success toast with default parameters', () => {
      const message = 'Operation successful';
      service.success(message);

      expect(snackBar.open).toHaveBeenCalledWith(
        message,
        '',
        jasmine.objectContaining({
          duration: 3000,
          horizontalPosition: 'end',
          verticalPosition: 'bottom',
          panelClass: ['toast-success', 'toast-notification']
        })
      );
    });

    it('should show success toast with custom action', () => {
      const message = 'Data saved';
      const action = 'Undo';
      service.success(message, action);

      expect(snackBar.open).toHaveBeenCalledWith(
        message,
        action,
        jasmine.objectContaining({
          duration: 3000,
          panelClass: ['toast-success', 'toast-notification']
        })
      );
    });

    it('should show success toast with custom duration', () => {
      const message = 'Booking confirmed';
      const action = '';
      const duration = 5000;
      service.success(message, action, duration);

      expect(snackBar.open).toHaveBeenCalledWith(
        message,
        action,
        jasmine.objectContaining({
          duration: 5000,
          panelClass: ['toast-success', 'toast-notification']
        })
      );
    });

    it('should show success toast with action and custom duration', () => {
      const message = 'Item added';
      const action = 'View';
      const duration = 4000;
      service.success(message, action, duration);

      expect(snackBar.open).toHaveBeenCalledWith(
        message,
        action,
        jasmine.objectContaining({
          duration: 4000,
          panelClass: ['toast-success', 'toast-notification']
        })
      );
    });
  });

  describe('error()', () => {
    it('should show error toast with default parameters', () => {
      const message = 'Operation failed';
      service.error(message);

      expect(snackBar.open).toHaveBeenCalledWith(
        message,
        '',
        jasmine.objectContaining({
          duration: 3000,
          horizontalPosition: 'end',
          verticalPosition: 'bottom',
          panelClass: ['toast-error', 'toast-notification']
        })
      );
    });

    it('should show error toast with custom action', () => {
      const message = 'Connection failed';
      const action = 'Retry';
      service.error(message, action);

      expect(snackBar.open).toHaveBeenCalledWith(
        message,
        action,
        jasmine.objectContaining({
          duration: 3000,
          panelClass: ['toast-error', 'toast-notification']
        })
      );
    });

    it('should show error toast with custom duration', () => {
      const message = 'Server error occurred';
      const action = '';
      const duration = 6000;
      service.error(message, action, duration);

      expect(snackBar.open).toHaveBeenCalledWith(
        message,
        action,
        jasmine.objectContaining({
          duration: 6000,
          panelClass: ['toast-error', 'toast-notification']
        })
      );
    });

    it('should show error toast with action and custom duration', () => {
      const message = 'Authentication failed';
      const action = 'Login';
      const duration = 7000;
      service.error(message, action, duration);

      expect(snackBar.open).toHaveBeenCalledWith(
        message,
        action,
        jasmine.objectContaining({
          duration: 7000,
          panelClass: ['toast-error', 'toast-notification']
        })
      );
    });
  });

  describe('info()', () => {
    it('should show info toast with default parameters', () => {
      const message = 'New update available';
      service.info(message);

      expect(snackBar.open).toHaveBeenCalledWith(
        message,
        '',
        jasmine.objectContaining({
          duration: 3000,
          horizontalPosition: 'end',
          verticalPosition: 'bottom',
          panelClass: ['toast-info', 'toast-notification']
        })
      );
    });

    it('should show info toast with custom action', () => {
      const message = 'Profile updated';
      const action = 'View';
      service.info(message, action);

      expect(snackBar.open).toHaveBeenCalledWith(
        message,
        action,
        jasmine.objectContaining({
          duration: 3000,
          panelClass: ['toast-info', 'toast-notification']
        })
      );
    });

    it('should show info toast with custom duration', () => {
      const message = 'Session expires soon';
      const action = '';
      const duration = 10000;
      service.info(message, action, duration);

      expect(snackBar.open).toHaveBeenCalledWith(
        message,
        action,
        jasmine.objectContaining({
          duration: 10000,
          panelClass: ['toast-info', 'toast-notification']
        })
      );
    });
  });

  describe('warning()', () => {
    it('should show warning toast with default parameters', () => {
      const message = 'Please verify your email';
      service.warning(message);

      expect(snackBar.open).toHaveBeenCalledWith(
        message,
        '',
        jasmine.objectContaining({
          duration: 3000,
          horizontalPosition: 'end',
          verticalPosition: 'bottom',
          panelClass: ['toast-warning', 'toast-notification']
        })
      );
    });

    it('should show warning toast with custom action', () => {
      const message = 'Low balance';
      const action = 'Add Funds';
      service.warning(message, action);

      expect(snackBar.open).toHaveBeenCalledWith(
        message,
        action,
        jasmine.objectContaining({
          duration: 3000,
          panelClass: ['toast-warning', 'toast-notification']
        })
      );
    });

    it('should show warning toast with custom duration', () => {
      const message = 'Incomplete profile';
      const action = '';
      const duration = 5000;
      service.warning(message, action, duration);

      expect(snackBar.open).toHaveBeenCalledWith(
        message,
        action,
        jasmine.objectContaining({
          duration: 5000,
          panelClass: ['toast-warning', 'toast-notification']
        })
      );
    });
  });

  describe('dismiss()', () => {
    it('should dismiss all active toasts', () => {
      service.dismiss();
      expect(snackBar.dismiss).toHaveBeenCalled();
    });

    it('should dismiss after showing multiple toasts', () => {
      service.success('Test 1');
      service.error('Test 2');
      service.dismiss();
      
      expect(snackBar.dismiss).toHaveBeenCalled();
    });
  });

  describe('Edge cases', () => {
    it('should handle empty message', () => {
      service.success('');
      expect(snackBar.open).toHaveBeenCalledWith('', '', jasmine.any(Object));
    });

    it('should handle very long message', () => {
      const longMessage = 'A'.repeat(500);
      service.info(longMessage);
      expect(snackBar.open).toHaveBeenCalledWith(longMessage, '', jasmine.any(Object));
    });

    it('should handle special characters in message', () => {
      const specialMessage = '<script>alert("test")</script> & special chars';
      service.warning(specialMessage);
      expect(snackBar.open).toHaveBeenCalledWith(specialMessage, '', jasmine.any(Object));
    });

    it('should handle zero duration by using default', () => {
      service.error('Error', '', 0);
      expect(snackBar.open).toHaveBeenCalledWith(
        'Error',
        '',
        jasmine.objectContaining({ duration: 3000 })  // Service uses default when 0 is passed
      );
    });

    it('should handle very large duration', () => {
      service.info('Info', '', 999999);
      expect(snackBar.open).toHaveBeenCalledWith(
        'Info',
        '',
        jasmine.objectContaining({ duration: 999999 })
      );
    });
  });

  describe('Multiple toasts', () => {
    it('should show multiple toasts in sequence', () => {
      service.success('First');
      service.error('Second');
      service.info('Third');

      expect(snackBar.open).toHaveBeenCalledTimes(3);
    });

    it('should show different toast types with different durations', () => {
      service.success('Success', '', 1000);
      service.error('Error', '', 2000);
      service.warning('Warning', '', 3000);
      service.info('Info', '', 4000);

      expect(snackBar.open).toHaveBeenCalledTimes(4);
    });
  });
});
