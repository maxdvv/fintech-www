import { Component, OnDestroy, OnInit } from "@angular/core";
import { InvestmentService } from "../services/investment.service";
import { ToastrService } from "ngx-toastr";
import { Subject, switchMap, takeUntil } from "rxjs";
import { CreateInvestmentResponse } from "../models/investment.model";

@Component({
  selector: 'app-investment',
  templateUrl: './investment.component.html',
  styleUrl: './investment.component.scss'
})
export class InvestmentComponent implements OnInit, OnDestroy {
  public investments: CreateInvestmentResponse[] = [];
  public displayedColumns: string[] = ['createdAt', 'deposit', 'availableProfit', 'availableBonus'];

  constructor(
    private investmentService: InvestmentService,
    private toastr: ToastrService
  ) { }

  private unsubscribe$ = new Subject();

  ngOnInit() {
    this.getInvestment();
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next(0);
    this.unsubscribe$.complete();
  }

  public getTotalCost(column: string): number {
    // @ts-ignore
    return this.investments.reduce((acc, investment) => acc + investment[column], 0);
  }

  private getInvestment(): void {
    const loginUser = JSON.parse(<string>localStorage.getItem('loginUser'));
    if (!loginUser) return;
    this.investmentService.isMakeInvestment$.pipe(
      switchMap(res => {
        return this.investmentService.getInvestment(loginUser.userId);
      }),
      takeUntil(this.unsubscribe$)
    ).subscribe(res => {
      this.investments = res;
    });
  }
}
