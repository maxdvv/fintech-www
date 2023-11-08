import { Body, Controller, Get, Param, Post, UseGuards, UsePipes, ValidationPipe } from "@nestjs/common";
import { InvestmentService } from "./investment.service";
import { Investment } from "./schemas/investment.schema";
import { createInvestmentDto } from "./dto/create-investment.dto";
import { LocalAuthGuard } from "../auth/local.auth.guard";
import { ApiBody, ApiResponse, ApiTags } from "@nestjs/swagger";
import { RolesGuard } from "../auth/role.guard";
import { UserRole } from "../auth/role.enum";
import { Roles } from "../common/decorators/roles.decorator";

@ApiTags('investment')
@Controller('investment')
export class InvestmentController {
  constructor(private investmentService: InvestmentService) {}

  @Post('add')
  @Roles(UserRole.USER, UserRole.INVESTOR)
  @UseGuards(RolesGuard)
  @UsePipes(new ValidationPipe())
  @UseGuards(LocalAuthGuard)
  @ApiBody({ type: createInvestmentDto })
  async createInvestment(@Body() investment: createInvestmentDto): Promise<Investment> {
    return this.investmentService.create(investment);
  }

  @Get(':id')
  @UseGuards(LocalAuthGuard)
  @ApiResponse({ status: 200, type: createInvestmentDto })
  async getInvestment(@Param('id') id: string): Promise<Investment> {
    return this.investmentService.findById(id);
  }

  @Get('user/:userId')
  @UseGuards(LocalAuthGuard)
  @ApiResponse({ status: 200, type: [createInvestmentDto] })
  async getInvestmentByUserId(@Param('userId') userId: string): Promise<Investment[]> {
    return this.investmentService.findAllByUserId(userId);
  }
}
