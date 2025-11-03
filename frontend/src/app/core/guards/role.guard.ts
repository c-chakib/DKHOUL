import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

export const roleGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  const requiredRoles = route.data['roles'] as string[];

  if (!authService.isAuthenticated()) {
    router.navigate(['/auth/login']);
    return false;
  }

  const currentUser = authService.currentUserValue;
  if (currentUser && requiredRoles.includes(currentUser.role)) {
    return true;
  }

  // User doesn't have required role
  router.navigate(['/']);
  return false;
};

