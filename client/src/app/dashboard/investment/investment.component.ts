import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { InvestmentService } from '../services/investment.service';
import { ToastrService } from 'ngx-toastr';
import { Subject, switchMap, takeUntil } from 'rxjs';
import { CreateInvestmentResponse } from '../models/investment.model';
import { LoginResponse } from '../../auth/auth.model';

@Component({
  selector: 'app-investment',
  templateUrl: './investment.component.html',
  styleUrl: './investment.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class InvestmentComponent implements OnInit, OnDestroy {
  public loading = false;
  // public noAvailableProfit
  public investments: CreateInvestmentResponse[] = [];
  public displayedColumns: string[] = ['createdAt', 'deposit', 'depositDays', 'profit', 'availableProfit'];

  constructor(
    private investmentService: InvestmentService,
    private cdr: ChangeDetectorRef,
    private toastr: ToastrService
  ) {}

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
    return +this.investments.reduce((acc, investment) => acc + investment[column], 0).toFixed(2);
  }

  public getAvailableProfit(): void {
    const loginUser = <LoginResponse>JSON.parse(<string>localStorage.getItem('loginUser'));
    if (!loginUser) return;

    this.investmentService.getAvailableProfit(loginUser.userId).pipe(takeUntil(this.unsubscribe$)).subscribe();
  }

  private getInvestment(): void {
    const loginUser = <LoginResponse>JSON.parse(<string>localStorage.getItem('loginUser'));
    if (!loginUser) return;

    this.loading = true;
    this.investmentService.isMakeInvestment$
      .pipe(
        switchMap(() => {
          return this.investmentService.getInvestment(loginUser.userId);
        }),
        takeUntil(this.unsubscribe$)
      )
      .subscribe((res) => {
        this.investments = res;
        this.loading = false;
        this.cdr.markForCheck();
      });
  }
}
