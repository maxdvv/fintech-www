import { Module } from '@nestjs/common';
import { WithdrawalsService } from './withdrawals.service';
import { WithdrawalsController } from './withdrawals.controller';
import { MongooseModule } from "@nestjs/mongoose";
import { Investment, investmentSchema } from "../investment/schemas/investment.schema";
import { InvestmentModule } from "../investment/investment.module";
import { withdrawalSchema } from "./schemas/withdrawals.schema";

@Module({
  imports: [
    InvestmentModule,
    MongooseModule.forFeature([
      { name: 'Investment', schema: investmentSchema },
      { name: 'Withdrawal', schema: withdrawalSchema },
    ])
  ],
  controllers: [WithdrawalsController],
  providers: [WithdrawalsService],
})
export class WithdrawalsModule {}
