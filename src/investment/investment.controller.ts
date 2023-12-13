import { Body, Controller, Get, Param, Post, UseGuards, UsePipes, ValidationPipe } from "@nestjs/common";
import { InvestmentService } from "./investment.service";
import { Investment } from "./schemas/investment.schema";
import { CreateInvestmentDto } from "./dto/create-investment.dto";
import { LocalAuthGuard } from "../auth/local.auth.guard";
import { ApiBody, ApiInternalServerErrorResponse, ApiResponse, ApiTags } from "@nestjs/swagger";
import { RolesGuard } from "../auth/role.guard";
import { UserRole } from "../auth/role.enum";
import { Roles } from "../common/decorators/roles.decorator";
import { CreateInvestmentResponseDto, InvestmentData } from "./response/create-investment-response.dto";
import { UserBonusResponseDto } from "./response/user-bonus-response.dto";

@ApiTags('investment')
@Controller('investment')
export class InvestmentController {
  constructor(private investmentService: InvestmentService) {}

  @Post('add')
  @Roles(UserRole.USER, UserRole.INVESTOR)
  @UseGuards(RolesGuard)
  @UsePipes(new ValidationPipe())
  @UseGuards(LocalAuthGuard)
  @ApiResponse({ status: 201, description: 'Investment has been successfully made.', type: CreateInvestmentResponseDto })
  @ApiResponse({ status: 400, description: 'Bad Request'})
  @ApiInternalServerErrorResponse({ description: 'Internal server error' })
  @ApiBody({ type: CreateInvestmentDto })
  async createInvestment(@Body() investment: CreateInvestmentDto): Promise<CreateInvestmentResponseDto> {
    return this.investmentService.create(investment);
  }

  @Get()
  @Roles(UserRole.ADMIN)
  @UseGuards(RolesGuard)
  @UseGuards(LocalAuthGuard)
  @ApiResponse({ status: 200, type: Number })
  async getAllInvestment(): Promise<number> {
    return this.investmentService.findSumAllInvestment();
  }

  @Get(':id')
  @UseGuards(LocalAuthGuard)
  @ApiResponse({ status: 200, type: InvestmentData })
  async getInvestment(@Param('id') id: string): Promise<Investment> {
    return this.investmentService.findById(id);
  }

  @Get('user/:userId')
  @UseGuards(LocalAuthGuard)
  @ApiResponse({ status: 200, type: [InvestmentData] })
  @ApiResponse({ status: 400, description: 'Bad Request'})
  @ApiInternalServerErrorResponse({ description: 'Internal server error' })
  async getInvestmentByUserId(@Param('userId') userId: string): Promise<Investment[]> {
    return this.investmentService.findAllInvestmentByUserId(userId);
  }

  @Get('bonus/:userId')
  @UseGuards(LocalAuthGuard)
  @ApiResponse({ status: 200, type: [UserBonusResponseDto] })
  @ApiResponse({ status: 400, description: 'Bad Request'})
  @ApiInternalServerErrorResponse({ description: 'Internal server error' })
  async getBonusByUserId(@Param('userId') userId: string): Promise<UserBonusResponseDto[]> {
    return this.investmentService.calculateBonusByUserId(userId);
  }
}
