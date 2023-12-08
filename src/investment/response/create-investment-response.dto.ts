import { ApiProperty } from "@nestjs/swagger";

export class InvestmentData {
  @ApiProperty()
  userId: string;

  @ApiProperty()
  deposit: number;

  @ApiProperty()
  profit: number;

  @ApiProperty()
  bonus: number;

  @ApiProperty()
  availableProfit: number;

  @ApiProperty()
  availableBonus: number;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;
}

export class CreateInvestmentResponseDto {
  @ApiProperty()
  status: string;

  @ApiProperty()
  data: InvestmentData;
}


