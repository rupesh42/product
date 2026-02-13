import { HttpInterceptorFn } from '@angular/common/http';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const myToken = 'token-123';
  const userRole = 'ADMIN';
  const clonedRequest = req.clone({
    setHeaders: {
      Authorization: `Bearer ${myToken}`,
      'X-User-Role': userRole,
    },
  });
  return next(clonedRequest);
};
