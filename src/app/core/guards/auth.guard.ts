import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService, AppRole } from '../auth/auth.service';

export const authGuard: CanActivateFn = (_route, state) => {
  const auth = inject(AuthService);
  const router = inject(Router);
  if (!auth.isAuthenticated()) {
    auth.clearSession();
    return router.createUrlTree(['/login'], { queryParams: { returnUrl: state.url } });
  }
  return true;
};

export const roleGuard: CanActivateFn = (route) => {
  const auth = inject(AuthService);
  const router = inject(Router);
  const user = auth.getUser();
  const allowed = route.data['roles'] as AppRole[] | undefined;
  if (!auth.isAuthenticated() || !user) {
    auth.clearSession();
    return router.createUrlTree(['/login']);
  }
  if (allowed?.includes(auth.normalizeRole(user.role) as AppRole)) return true;
  return router.createUrlTree([auth.dashboardUrl(user.role)]);
};

export const guestGuard: CanActivateFn = () => {
  const auth = inject(AuthService);
  const router = inject(Router);
  return auth.isAuthenticated() ? router.parseUrl(auth.dashboardUrl()) : true;
};
