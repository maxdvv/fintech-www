import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { apis } from '../../../environments';
import { HttpClient } from '@angular/common/http';
import { CreateInvestmentResponse, ServerResponse, UserBonus } from '../models/investment.model';

@Injectable({
  providedIn: 'root'
})
export class InvestmentService {
  public isMakeInvestment$ = new BehaviorSubject(false);
  constructor(private http: HttpClient) {}

  public addInvestment(
    userId: string,
    deposit: number
  ): Observable<ServerResponse<CreateInvestmentResponse>> {
    return this.http.post<ServerResponse<CreateInvestmentResponse>>(
      apis.addInvestment,
      { userId, deposit },
      { withCredentials: true }
    );
  }

  public getInvestment(userId: string): Observable<CreateInvestmentResponse[]> {
    return this.http.get<CreateInvestmentResponse[]>(`${apis.getInvestmentByUserId}/${userId}`, {
      withCredentials: true
    });
  }

  public getBonus(userId: string): Observable<UserBonus[]> {
    return this.http.get<UserBonus[]>(`${apis.getBonusByUserId}/${userId}`, {
      withCredentials: true
    });
  }
}
