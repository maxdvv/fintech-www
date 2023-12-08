import { Injectable, InternalServerErrorException, NotFoundException } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Investment } from "./schemas/investment.schema";
import { User } from "../auth/schemas/user.schema";
import { Model } from "mongoose";
import { UserRole } from "../auth/role.enum";
import { createInvestmentDto } from "./dto/create-investment.dto";
import { Cron, CronExpression } from "@nestjs/schedule";
import { InvitationCodes } from "../invitation-codes/schemas/invitation-codes.schema";
import { CreateInvestmentResponseDto } from "./response/create-investment-response.dto";

const INVESTOR_FUNDS_DAILY_COEFFICIENT = 0.01;
const INVITER_BONUS_COEFFICIENT = 0.1;
const MILLISECONDS_IN_ONE_DAY = 24 * 60 * 60 * 1000;

@Injectable()
export class InvestmentService {
  constructor(
    @InjectModel(Investment.name) private investmentModel: Model<Investment>,
    @InjectModel(User.name) private userModel: Model<User>,
    @InjectModel(InvitationCodes.name) private invitationCodesModel: Model<InvitationCodes>
  ) {}

  @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT)
  async calculateDepositGrowth() {
    const investments = await this.investmentModel.find();

    for (const investment of investments) {
      const depositMilliseconds = new Date().getTime() - new Date(investment.createdAt).getTime();
      const depositDays = Math.round(depositMilliseconds / MILLISECONDS_IN_ONE_DAY);
      const profit = investment.deposit * depositDays * INVESTOR_FUNDS_DAILY_COEFFICIENT;
      await this.investmentModel.findByIdAndUpdate(investment._id,{ profit });
    }
  }

  @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT)
  async calculateBonusGrowth(): Promise<any> {
    const invitedUsers = await this.userModel.aggregate([
      {
        $match: {
          invitationCode: { $ne: '' },
        },
      },
      {
        $group: {
          _id: '$invitationCode',
          invitedUsers: { $push: '$_id' },
        },
      },
      {
        $lookup: {
          from: 'invitationcodes',
          localField: '_id',
          foreignField: 'investorInvitationCode',
          as: 'inviter'
        }
      },
    ]).exec();

    const profitGroupByUser = await this.investmentModel.aggregate([
      {
        $group: {
          _id: '$userId',
          totalProfit: { $sum: '$profit' },
        },
      },
    ]).exec();

    invitedUsers.forEach(invitedUser => {
      invitedUser.userId = invitedUser.inviter[0].userId;
      invitedUser.bonus = 0;
      const iUsers = invitedUser.invitedUsers.map(user => user._id.toString());

      profitGroupByUser.forEach(profit => {
        if (iUsers.includes(profit._id)) {
          invitedUser.bonus += profit.totalProfit * INVITER_BONUS_COEFFICIENT;
        }
      })
    });

    for (const invited of invitedUsers) {
      await this.investmentModel.findOneAndUpdate(
        { _id: invited.userId },
        { $set: { ['bonus']: invited.bonus } },
        { new: true }
      );
    }

    return invitedUsers;
  }

  async create(investment: createInvestmentDto): Promise<CreateInvestmentResponseDto> {
    const { userId, deposit } = investment;
    const updatedUserRole = await this.userModel.findOneAndUpdate(
      { _id: investment.userId, role: { $in: [UserRole.USER, UserRole.INVESTOR] } },
      { $set: { ['role']: UserRole.INVESTOR } },
      { new: true }
    );

    if (!updatedUserRole) {
      console.error('Update error');
    }

    const data: Investment =  await this.investmentModel.create({
      userId,
      deposit,
      profit: 0,
      bonus: 0,
      availableProfit: 0,
      availableBonus: 0
    });

    if (!data) {
      throw new InternalServerErrorException('Investment created error!');
    }

    return {
      status: 'SUCCESS',
      data
    }
  }

  async updateAvailableProfitById(id: string, value: number): Promise<any> {
    const updatedAvailableProfit = await this.investmentModel.findOneAndUpdate(
      { _id: id },
      { $set: { ['availableProfit']: value } },
      { new: true }
    );

    if (!updatedAvailableProfit) {
      console.error('Update error');
    }

    return updatedAvailableProfit;
  }

  async updateAvailableBonusById(id: string, value: number): Promise<any> {
    const updatedAvailableBonus = await this.investmentModel.findOneAndUpdate(
      { _id: id },
      { $set: { ['availableBonus']: value } },
      { new: true }
    );

    if (!updatedAvailableBonus) {
      console.error('Update error');
    }

    return updatedAvailableBonus;
  }

  async findById(id: string): Promise<Investment> {
    const investment = await this.investmentModel.findById(id);

    if (!investment) {
      throw new NotFoundException('Investment not found');
    }

    return investment;
  }

  async findAllByUserId(userId: string): Promise<Investment[]> {
    const investment: Investment[] = await this.investmentModel.find({ userId });

    if (!investment?.length) {
      throw new NotFoundException('Investment not found');
    }

    return investment;
  }

  async findSumAllInvestment(): Promise<number> {
    const investmentSumAggregationRes = await this.investmentModel.aggregate([
      {
        $group: {
          _id: null,
          total: { $sum: '$deposit' },
        },
      },
    ]).exec();

    return investmentSumAggregationRes.length > 0 ? investmentSumAggregationRes[0].total : 0;
  }

  async findAll(): Promise<Investment[]> {
    return (await this.investmentModel.find());
  }
}
