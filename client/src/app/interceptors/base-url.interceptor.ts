import { Injectable } from '@angular/core';
import {
  HttpEvent,
  HttpInterceptor,
  HttpHandler,
  HttpRequest,
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from "../../environments";

@Injectable()
export class BaseUrlInterceptor implements HttpInterceptor {
  private baseUrl = environment.apiUrl;

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const modifiedRequest = request.clone({
      url: this.baseUrl + request.url,
    });

    return next.handle(modifiedRequest);
  }
}
