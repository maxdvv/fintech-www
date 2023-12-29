import { Module } from '@nestjs/common';
import { InvestmentController } from './investment.controller';
import { InvestmentService } from './investment.service';
import { MongooseModule } from '@nestjs/mongoose';
import { investmentSchema } from './schemas/investment.schema';
import { AuthModule } from '../auth/auth.module';
import { UserSchema } from '../auth/schemas/user.schema';
import { InvitationCodesSchema } from '../invitation-codes/schemas/invitation-codes.schema';
import { withdrawalSchema } from '../withdrawals/schemas/withdrawals.schema';

@Module({
  imports: [
    AuthModule,
    MongooseModule.forFeature([
      { name: 'Investment', schema: investmentSchema },
      { name: 'User', schema: UserSchema },
      { name: 'InvitationCodes', schema: InvitationCodesSchema },
      { name: 'Withdrawal', schema: withdrawalSchema },
    ]),
  ],
  controllers: [InvestmentController],
  providers: [InvestmentService],
  exports: [InvestmentService],
})
export class InvestmentModule {}
