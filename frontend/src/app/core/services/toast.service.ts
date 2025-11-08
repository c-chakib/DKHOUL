import { Injectable } from '@angular/core';
import { MatSnackBar, MatSnackBarConfig } from '@angular/material/snack-bar';

@Injectable({
  providedIn: 'root'
})
export class ToastService {
  private defaultConfig: MatSnackBarConfig = {
    duration: 3000,
    horizontalPosition: 'end',
    verticalPosition: 'bottom',
    panelClass: []
  };

  constructor(private snackBar: MatSnackBar) {}

  /**
   * Show success toast notification
   * @param message - Message to display
   * @param action - Optional action button text
   * @param duration - Optional duration (default 3000ms)
   */
  success(message: string, action: string = '', duration?: number): void {
    this.show(message, action, 'toast-success', duration);
  }

  /**
   * Show error toast notification
   * @param message - Message to display
   * @param action - Optional action button text
   * @param duration - Optional duration (default 3000ms)
   */
  error(message: string, action: string = '', duration?: number): void {
    this.show(message, action, 'toast-error', duration);
  }

  /**
   * Show info toast notification
   * @param message - Message to display
   * @param action - Optional action button text
   * @param duration - Optional duration (default 3000ms)
   */
  info(message: string, action: string = '', duration?: number): void {
    this.show(message, action, 'toast-info', duration);
  }

  /**
   * Show warning toast notification
   * @param message - Message to display
   * @param action - Optional action button text
   * @param duration - Optional duration (default 3000ms)
   */
  warning(message: string, action: string = '', duration?: number): void {
    this.show(message, action, 'toast-warning', duration);
  }

  /**
   * Generic show method
   * @param message - Message to display
   * @param action - Optional action button text
   * @param panelClass - CSS class for styling
   * @param duration - Optional duration
   */
  private show(message: string, action: string, panelClass: string, duration?: number): void {
    const config: MatSnackBarConfig = {
      ...this.defaultConfig,
      duration: duration || this.defaultConfig.duration,
      panelClass: [panelClass, 'toast-notification']
    };

    this.snackBar.open(message, action, config);
  }

  /**
   * Dismiss all active toasts
   */
  dismiss(): void {
    this.snackBar.dismiss();
  }
}
