import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  OnDestroy,
  OnInit
} from '@angular/core';
import { UserBonus } from '../models/investment.model';
import { InvestmentService } from '../services/investment.service';
import { ToastrService } from 'ngx-toastr';
import { Subject, takeUntil } from 'rxjs';
import { LoginResponse } from '../../auth/auth.model';

@Component({
  selector: 'app-bonus',
  templateUrl: './bonus.component.html',
  styleUrl: './bonus.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class BonusComponent implements OnInit, OnDestroy {
  public bonus: UserBonus[] = [];
  public totalBonus = 0;
  public displayedColumns: string[] = ['userName', 'email', 'bonus'];

  constructor(
    private investmentService: InvestmentService,
    private cdr: ChangeDetectorRef,
    private toastr: ToastrService
  ) {}

  private unsubscribe$ = new Subject();

  ngOnInit(): void {
    this.getBonus();
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next(0);
    this.unsubscribe$.complete();
  }

  private getBonus(): void {
    const loginUser = <LoginResponse>JSON.parse(<string>localStorage.getItem('loginUser'));
    if (!loginUser) return;

    this.investmentService
      .getBonus(loginUser.userId)
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe((res) => {
        this.bonus = res;
        this.totalBonus = this.bonus.reduce((acc, item) => acc + item.bonus, 0);
        this.cdr.markForCheck();
      });
  }
}
