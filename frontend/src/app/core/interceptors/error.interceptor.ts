import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, throwError } from 'rxjs';
import { Router } from '@angular/router';
import { ToastService } from '../services/toast.service';
import { LoggerService } from '../services/logger.service';

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  const router = inject(Router);
  const toastService = inject(ToastService);
  const logger = inject(LoggerService);

  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      let errorMessage = 'An error occurred';
      let shouldShowToast = true;

      // Skip toast for certain endpoints that handle their own errors
      const skipToastUrls = ['/auth/login', '/auth/register', '/auth/forgot-password'];
      const shouldSkipToast = skipToastUrls.some(url => req.url.includes(url));

      if (error.error instanceof ErrorEvent) {
        // Client-side error (network error, etc.)
        errorMessage = error.error.message || 'Network error. Please check your connection.';
        logger.error('Client-side error', error.error);
      } else {
        // Server-side error
        errorMessage = error.error?.message || error.error?.error || error.message || 'An error occurred';

        // Handle specific error codes
        switch (error.status) {
          case 401:
            // Unauthorized - redirect to login
            if (!shouldSkipToast) {
              toastService.error('Your session has expired. Please log in again.', 'Close', 5000);
            }
            localStorage.removeItem('token');
            localStorage.removeItem('currentUser');
            // Only redirect if not already on login page
            if (!router.url.includes('/auth/login')) {
              router.navigate(['/auth/login']);
            }
            shouldShowToast = false; // Don't show duplicate error
            break;
          case 403:
            // Forbidden
            errorMessage = error.error?.message || 'You do not have permission to access this resource';
            break;
          case 404:
            errorMessage = error.error?.message || 'Resource not found';
            break;
          case 422:
            // Validation error
            errorMessage = error.error?.message || 'Validation error. Please check your input.';
            break;
          case 429:
            // Rate limit
            errorMessage = 'Too many requests. Please try again later.';
            break;
          case 500:
            errorMessage = error.error?.message || 'Internal server error. Please try again later.';
            break;
          case 503:
            errorMessage = 'Service temporarily unavailable. Please try again later.';
            break;
          default:
            errorMessage = error.error?.message || error.error?.error || `Error ${error.status}: ${error.message}`;
        }

        logger.error(`HTTP ${error.status} error`, {
          url: req.url,
          method: req.method,
          error: error.error,
          status: error.status
        });
      }

      // Show toast notification if appropriate
      if (shouldShowToast && !shouldSkipToast && error.status !== 401) {
        toastService.error(errorMessage, 'Close', 5000);
      }

      return throwError(() => error);
    })
  );
};

