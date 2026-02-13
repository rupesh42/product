import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { catchError, throwError } from 'rxjs';

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      let errorMessage = 'An unknwown error occurred!';
      if (error.error instanceof ErrorEvent) {
        errorMessage = `Error: ${error.error.message}`;
      } else {
        switch (error.status) {
          case 401:
            errorMessage = 'You are not authorized to use this service';
            break;
          case 403:
            errorMessage = 'You do not have permission to access this resource';
            break;
          case 404:
            errorMessage = 'The requested resource was not found';
            break;
          case 500:
            errorMessage = 'An internal server error occurred';
            break;
          case 502:
            errorMessage = 'Bad gateway error';
            break;
          case 503:
            errorMessage = 'Service is temporarily unavailable';
            break;
          default:
            errorMessage = `Error: ${error.status}, ${error.message}`;
        }
      }
      return throwError(() => error);
    }),
  );
};
