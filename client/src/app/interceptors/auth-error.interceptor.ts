import { Injectable } from "@angular/core";
import { HttpErrorResponse, HttpHandler, HttpInterceptor, HttpRequest } from "@angular/common/http";
import { catchError, Observable, throwError } from "rxjs";
import { Router } from "@angular/router";

@Injectable()
export class AuthErrorInterceptor implements HttpInterceptor {

  constructor(private router: Router) {
  }

  intercept(
    request: HttpRequest<any>,
    next: HttpHandler
  ): Observable<any> {
    return next.handle(request).pipe(
      catchError((error: HttpErrorResponse) => {
        if (error.status === 401 && error.error.message === 'Unauthorized') {
          localStorage.removeItem('loginUser');
          this.router.navigate(['/login']);
          console.error('Unauthorized');
        }

        return throwError(error);
      })
    );
  }
}
