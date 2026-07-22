import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { map, take } from 'rxjs';
import { AuthService } from '../services/auth.service';

export const staffGuard: CanActivateFn = (route) => {
  const auth = inject(AuthService);
  const router = inject(Router);
  const requiredRole = route.data?.['role'] as 'admin' | undefined;

  return auth.fetchMe().pipe(
    take(1),
    map((res) => {
      const user = res.user;
      if (!user || (requiredRole === 'admin' && user.role !== 'admin')) {
        router.navigate(['/login']);
        return false;
      }
      return true;
    })
  );
};
