import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";
import { apis } from "../../environments";
import { AuthData, LoginResponse } from "./auth.model";

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  constructor(private http: HttpClient) {}

  public signUp(data: AuthData): Observable<AuthData> {
    const url = apis.signUp;

    return this.http.post<AuthData>(url, data);
  }

  public login(username: string, password: string): Observable<LoginResponse> {
    const url = apis.login;

    return this.http.post<LoginResponse>(url, { username, password }, { withCredentials: true });
  }

  public logout(): Observable<any> {
    return this.http.get(apis.logout, { withCredentials: true });
  }

  public isAuthenticatedUser(): boolean {
    return !!localStorage.getItem('loginUser');
  }
}
