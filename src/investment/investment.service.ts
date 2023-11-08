import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Investment } from "./schemas/investment.schema";
import { User } from "../auth/schemas/user.schema";
import { Model } from "mongoose";
import { UserRole } from "../auth/role.enum";

@Injectable()
export class InvestmentService {
  constructor(
    @InjectModel(Investment.name) private investmentModel: Model<Investment>,
    @InjectModel(User.name) private userModel: Model<User>
  ) {}

  async create(investment: Investment): Promise<Investment> {
    const updatedUserRole = await this.userModel.findOneAndUpdate(
      { _id: investment.userId, role: UserRole.USER || UserRole.INVESTOR },
      { $set: { ['role']: UserRole.INVESTOR } },
      { new: true }
    );

    if (!updatedUserRole) {
      console.error('Update error');
    }

    return await this.investmentModel.create(investment);
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
}
