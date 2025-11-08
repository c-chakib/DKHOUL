import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthService } from '../services/auth.service';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  // Check localStorage directly as a fallback
  const token = localStorage.getItem('token');

  // Don't add token to login, register, forgot-password, and reset-password requests
  const excludedUrls = ['/auth/login', '/auth/register', '/auth/forgot-password', '/auth/reset-password'];
  const shouldExclude = excludedUrls.some(url => req.url.includes(url));

  if (token && !shouldExclude) {
    req = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`
      }
    });
  }

  return next(req);
};

