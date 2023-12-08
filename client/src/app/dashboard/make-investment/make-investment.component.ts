import { Component } from '@angular/core';
import { FormControl, Validators } from "@angular/forms";
import { InvestmentService } from "../services/investment.service";
import { Subject, takeUntil } from "rxjs";
import { ToastrService } from "ngx-toastr";

@Component({
  selector: 'app-make-investment',
  templateUrl: './make-investment.component.html',
  styleUrl: './make-investment.component.scss'
})
export class MakeInvestmentComponent {
  userMoneyFormControl: FormControl<number | null> = new FormControl(null, [Validators.required, Validators.min(1)]);

  constructor(
    private investmentService: InvestmentService,
    private toastr: ToastrService
  ) { }

  private unsubscribe$ = new Subject();

  ngOnDestroy(): void {
    this.unsubscribe$.next(0);
    this.unsubscribe$.complete();
  }

  public makeInvest(): void {
    const userMoney: number = <number>this.userMoneyFormControl.value;
    const loginUser = JSON.parse(<string>localStorage.getItem('loginUser'));
    if (!loginUser || !userMoney) {
      return;
    }

    this.investmentService.addInvestment(loginUser.userId, userMoney).pipe(
      takeUntil(this.unsubscribe$)
    ).subscribe(res => {
      if (res.status === 'SUCCESS') {
        console.log('res', res);
        this.userMoneyFormControl.reset();
        this.investmentService.isMakeInvestment$.next(true);
        this.toastr.success('You have successfully made investment', 'Success');
      }

    })
  }
}
