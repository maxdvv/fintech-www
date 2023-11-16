import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString } from "class-validator";

export class WithdrawDepositDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  readonly sum: number;
}
