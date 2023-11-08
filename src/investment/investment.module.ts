import { Module } from '@nestjs/common';
import { InvestmentController } from './investment.controller';
import { InvestmentService } from './investment.service';
import { MongooseModule } from "@nestjs/mongoose";
import { investmentSchema } from "./schemas/investment.schema";
import { AuthModule } from "../auth/auth.module";
import { UserSchema } from "../auth/schemas/user.schema";

@Module({
  imports: [
    AuthModule,
    MongooseModule.forFeature([
      { name: 'Investment', schema: investmentSchema },
      { name: 'User', schema: UserSchema }
    ])
  ],
  controllers: [InvestmentController],
  providers: [InvestmentService]
})
export class InvestmentModule {}
