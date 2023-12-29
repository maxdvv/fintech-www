import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { Subject, takeUntil } from 'rxjs';
import { WithdrawalService } from '../services/withdrawal.service';
import { LoginResponse } from '../../auth/auth.model';
import { UserWithdrawal } from '../models/withdrawal.model';

@Component({
  selector: 'app-withdrawal',
  templateUrl: './withdrawal.component.html',
  styleUrl: './withdrawal.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class WithdrawalComponent implements OnInit, OnDestroy {
  public loading = false;
  public userWithdrawal: UserWithdrawal[] = [];
  public totalWithdrawalSum = 0;
  public displayedColumns: string[] = ['createdAt', 'category', 'sum'];

  constructor(
    private withdrawalService: WithdrawalService,
    private cdr: ChangeDetectorRef
  ) {}

  private unsubscribe$ = new Subject();

  ngOnInit() {
    this.getUserWithdrawal();
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next(0);
    this.unsubscribe$.complete();
  }

  public getUserWithdrawal(): void {
    const loginUser = <LoginResponse>JSON.parse(<string>localStorage.getItem('loginUser'));
    if (!loginUser) return;

    this.withdrawalService
      .getUserWithdrawal(loginUser.userId)
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe((res) => {
        this.userWithdrawal = res;
        this.totalWithdrawalSum = +this.userWithdrawal.reduce((acc, item) => acc + item.sum, 0).toFixed(2);
        console.log('res', res);
        this.cdr.markForCheck();
      });
  }
}
