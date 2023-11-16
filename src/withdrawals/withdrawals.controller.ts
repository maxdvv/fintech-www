import { Controller, Get, Post, Body, UseGuards } from "@nestjs/common";
import { WithdrawalsService } from './withdrawals.service';
import { ApiResponse, ApiTags } from "@nestjs/swagger";
import { InvestmentService } from "../investment/investment.service";
import { Roles } from "../common/decorators/roles.decorator";
import { UserRole } from "../auth/role.enum";
import { RolesGuard } from "../auth/role.guard";
import { LocalAuthGuard } from "../auth/local.auth.guard";
import { WithdrawDepositDto } from "./dto/withdraw-deposit";
import { WithdrawProfitDto } from "./dto/withdraw-profit.dto";

@ApiTags('withdrawals')
@Controller('withdrawals')
export class WithdrawalsController {
  constructor(private readonly withdrawalsService: WithdrawalsService, private investmentService: InvestmentService) {}

  @Post('profit')
  @Roles(UserRole.INVESTOR)
  @UseGuards(RolesGuard)
  @UseGuards(LocalAuthGuard)
  withdrawProfit(@Body() withdrawProfitDto: WithdrawProfitDto) {
    return this.withdrawalsService.withdrawProfit(withdrawProfitDto);
  }

  @Post('bonus')
  @Roles(UserRole.INVESTOR)
  @UseGuards(RolesGuard)
  @UseGuards(LocalAuthGuard)
  withdrawBonus(@Body() withdrawProfitDto: WithdrawProfitDto) {
    return this.withdrawalsService.withdrawBonus(withdrawProfitDto);
  }

  @Post('deposit')
  @Roles(UserRole.ADMIN)
  @UseGuards(RolesGuard)
  @UseGuards(LocalAuthGuard)
  withdrawDeposit(@Body() withdrawDepositDto: WithdrawDepositDto) {
    return this.withdrawalsService.withdrawDeposit(withdrawDepositDto);
  }

  @Get()
  @Roles(UserRole.ADMIN)
  @UseGuards(RolesGuard)
  @UseGuards(LocalAuthGuard)
  @ApiResponse({ status: 200, type: Number })
  async getAllWithdrawal(): Promise<number> {
    return this.withdrawalsService.findSumAllWithdrawal();
  }
}
