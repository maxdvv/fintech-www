import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { apis } from '../../../environments';
import { UserWithdrawal } from '../models/withdrawal.model';

@Injectable({
  providedIn: 'root'
})
export class WithdrawalService {
  constructor(private http: HttpClient) {}

  public getUserWithdrawal(userId: string): Observable<UserWithdrawal[]> {
    return this.http.get<UserWithdrawal[]>(`${apis.getUserWithdrawal}/${userId}`, {
      withCredentials: true
    });
  }

}
