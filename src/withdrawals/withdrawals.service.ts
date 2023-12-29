import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InvestmentService } from '../investment/investment.service';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Withdrawal } from './schemas/withdrawals.schema';
import { WithdrawalCategory } from './withdrawal.enum';
import { WithdrawDepositDto } from './dto/withdraw-deposit';
import { WithdrawProfitDto } from './dto/withdraw-profit.dto';
import { Investment } from '../investment/schemas/investment.schema';

@Injectable()
export class WithdrawalsService {
  constructor(
    private investmentService: InvestmentService,
    @InjectModel(Investment.name) private investmentModel: Model<Investment>,
    @InjectModel(Withdrawal.name) private withdrawalModel: Model<Withdrawal>,
  ) {}

  async withdrawAvailableProfit(userId: string): Promise<Withdrawal[]> {
    const withdrawProfit: Withdrawal[] = await this.investmentModel
      .aggregate([
        {
          $match: {
            userId,
            availableProfit: { $gt: 0 },
          },
        },
        {
          $project: {
            userId: 1,
            investmentId: { $toString: '$_id' },
            createdAt: new Date(),
            updatedAt: new Date(),
            category: 'PROFIT',
            sum: '$availableProfit',
          },
        },
        {
          $out: 'withdrawals',
        },
      ])
      .exec();

    return withdrawProfit;
  }

  async withdrawProfit(
    withdrawProfitDto: WithdrawProfitDto,
  ): Promise<Withdrawal> {
    const { userId, investmentId, sum } = withdrawProfitDto;
    const investment = await this.investmentService.findById(investmentId);

    if (!investment) {
      throw new NotFoundException('Investment not found');
    }

    const isWithdrawalExist = !!(await this.withdrawalModel.count());

    if (!isWithdrawalExist && investment.profit < sum) {
      throw new InternalServerErrorException('Insufficient funds');
    }

    if (isWithdrawalExist) {
      const withdrawProfitAggregationRes = await this.withdrawalModel
        .aggregate([
          {
            $match: {
              userId,
              investmentId,
              category: WithdrawalCategory.PROFIT,
            },
          },
          {
            $group: {
              _id: null,
              total: { $sum: '$sum' },
            },
          },
        ])
        .exec();

      const withdrawProfit =
        withdrawProfitAggregationRes.length > 0
          ? withdrawProfitAggregationRes[0].total
          : 0;

      if (investment.profit < +sum + withdrawProfit) {
        throw new InternalServerErrorException('Insufficient funds');
      }

      const availableProfit = investment.profit - withdrawProfit - sum;
      await this.investmentService.updateAvailableProfitById(
        investmentId,
        availableProfit,
      );
    }

    const withdrawalCreated = await this.withdrawalModel.create({
      userId,
      investmentId,
      category: WithdrawalCategory.PROFIT,
      sum,
    });

    if (!withdrawalCreated) {
      throw new InternalServerErrorException('Created error');
    }

    return withdrawalCreated;
  }

  async withdrawBonus(
    withdrawProfitDto: WithdrawProfitDto,
  ): Promise<Withdrawal> {
    const { userId, investmentId, sum } = withdrawProfitDto;
    const investment = await this.investmentService.findById(investmentId);

    if (!investment) {
      throw new NotFoundException('Investment not found');
    }

    const isWithdrawalExist = !!(await this.withdrawalModel.count());

    if (!isWithdrawalExist && investment.profit < sum) {
      throw new InternalServerErrorException('Insufficient funds');
    }

    if (isWithdrawalExist) {
      const withdrawBonusAggregationRes = await this.withdrawalModel
        .aggregate([
          {
            $match: {
              userId,
              investmentId,
              category: WithdrawalCategory.BONUS,
            },
          },
          {
            $group: {
              _id: null,
              total: { $sum: '$sum' },
            },
          },
        ])
        .exec();

      const withdrawBonus =
        withdrawBonusAggregationRes.length > 0
          ? withdrawBonusAggregationRes[0].total
          : 0;

      if (investment.bonus < +sum + withdrawBonus) {
        throw new InternalServerErrorException('Insufficient funds');
      }

      const availableBonus = investment.bonus - withdrawBonus - sum;
      await this.investmentService.updateAvailableBonusById(
        investmentId,
        availableBonus,
      );
    }

    const withdrawalCreated = await this.withdrawalModel.create({
      userId,
      investmentId,
      category: WithdrawalCategory.BONUS,
      sum,
    });

    if (!withdrawalCreated) {
      throw new InternalServerErrorException('Created error');
    }

    return withdrawalCreated;
  }

  async withdrawDeposit(
    withdrawDepositDto: WithdrawDepositDto,
  ): Promise<Withdrawal> {
    const { sum } = withdrawDepositDto;
    const investmentSum = await this.investmentService.findSumAllInvestment();

    if (!investmentSum) {
      throw new NotFoundException('Investment not found');
    }

    const isWithdrawalExist = !!(await this.withdrawalModel.count());

    if (!isWithdrawalExist) {
      throw new InternalServerErrorException('Insufficient funds');
    }

    if (isWithdrawalExist) {
      const withdrawDepositAggregationRes = await this.withdrawalModel
        .aggregate([
          {
            $match: {
              category: WithdrawalCategory.DEPOSIT,
            },
          },
          {
            $group: {
              _id: null,
              total: { $sum: '$sum' },
            },
          },
        ])
        .exec();

      const withdrawDeposit =
        withdrawDepositAggregationRes.length > 0
          ? withdrawDepositAggregationRes[0].total
          : 0;

      if (investmentSum < +sum + withdrawDeposit) {
        throw new InternalServerErrorException('Insufficient funds');
      }
    }

    const withdrawalCreated = await this.withdrawalModel.create({
      category: WithdrawalCategory.DEPOSIT,
      sum,
    });

    if (!withdrawalCreated) {
      throw new InternalServerErrorException('Created error');
    }

    return withdrawalCreated;
  }

  async findSumAllWithdrawal(): Promise<number> {
    const withdrawalSumAggregationRes = await this.withdrawalModel
      .aggregate([
        {
          $group: {
            _id: null,
            total: { $sum: '$sum' },
          },
        },
      ])
      .exec();

    return withdrawalSumAggregationRes.length > 0
      ? withdrawalSumAggregationRes[0].total
      : 0;
  }

  async findWithdrawProfitByUserId(userId: string): Promise<number> {
    const userWithdrawProfit = await this.withdrawalModel.find({ userId });
    return userWithdrawProfit.reduce((acc, item) => (acc += item.sum), 0);
  }

  async findWithdrawProfitByInvestmentId(
    investmentId: string,
  ): Promise<number> {
    const userWithdrawProfit = await this.withdrawalModel.find({
      investmentId,
    });
    return userWithdrawProfit.reduce((acc, item) => (acc += item.sum), 0);
  }

  async allUserWithdrawal(userId: string): Promise<Withdrawal[]> {
    return this.withdrawalModel.find({ userId });
  }

  async findAll(): Promise<Withdrawal[]> {
    return this.withdrawalModel.find();
  }

  async findOne(id: number): Promise<Withdrawal> {
    const foundWithdrawal = await this.withdrawalModel.findById({ _id: id });

    if (!foundWithdrawal) {
      throw new NotFoundException('Withdrawal not found');
    }

    return foundWithdrawal;
  }
}
