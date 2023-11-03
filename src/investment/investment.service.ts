import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Investment } from "./schemas/investment.schema";
import * as mongoose from "mongoose";

@Injectable()
export class InvestmentService {
  constructor(
    @InjectModel(Investment.name) private investmentModel: mongoose.Model<Investment>
  ) {}

  async create(investment: Investment): Promise<Investment> {
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
