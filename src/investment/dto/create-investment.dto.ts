import { IsNotEmpty, IsNumber, IsString } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";


export class createInvestmentDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsNumber()
  readonly amount: number;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  readonly userId: string;
}
