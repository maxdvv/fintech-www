import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { RouterModule } from '@angular/router';
import { DashboardComponent } from './dashboard.component';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatTabsModule } from '@angular/material/tabs';
import { InvestmentComponent } from './investment/investment.component';
import { MakeInvestmentComponent } from './make-investment/make-investment.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatTableModule } from '@angular/material/table';
import { BonusComponent } from './bonus/bonus.component';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { DaysBetweenTwoDatePipe } from './pipes/days-between-two-date.pipe';
import { WithdrawalComponent } from './withdrawal/withdrawal.component';

@NgModule({
  declarations: [DashboardComponent, MakeInvestmentComponent, InvestmentComponent, BonusComponent, WithdrawalComponent],
  imports: [
    CommonModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    MatToolbarModule,
    MatButtonModule,
    MatIconModule,
    MatTabsModule,
    MatInputModule,
    MatFormFieldModule,
    MatButtonModule,
    MatTableModule,
    MatProgressSpinnerModule,
    RouterModule,
    DaysBetweenTwoDatePipe
  ],
  exports: [DashboardComponent, MakeInvestmentComponent, InvestmentComponent, BonusComponent, WithdrawalComponent]
})
export class DashboardModule {}
