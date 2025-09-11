import { inject } from '@angular/core';
import { CanActivateFn, Router, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { AuthService } from '../services/auth.service';

export const authGuard: CanActivateFn = (route: ActivatedRouteSnapshot, state: RouterStateSnapshot) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  // Debug log (remove after testing)
  console.log('[authGuard] checking isLoggedIn():', authService.isLoggedIn(), 'requestedUrl=', state.url);

  if (authService.isLoggedIn()) {
    return true;
  }

  // Not logged in -> redirect to signin with returnUrl so user returns after login
  return router.createUrlTree(['/signin'], { queryParams: { returnUrl: state.url } });
};
