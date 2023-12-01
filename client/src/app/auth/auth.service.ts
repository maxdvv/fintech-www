import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";
import { apis } from "../../environments";
import { AuthData } from "./auth.model";

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  constructor(private http: HttpClient) {}

  signUp(data: AuthData): Observable<AuthData> {
    const url = apis.signUp;

    return this.http.post<AuthData>(url, data);
  }

  login(username: string, password: string): Observable<AuthData> {
    const url = apis.login;

    return this.http.post<AuthData>(url, { username, password });
  }

}
