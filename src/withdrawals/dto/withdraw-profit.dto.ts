import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString } from "class-validator";

export class WithdrawProfitDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  readonly userId: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  readonly investmentId: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  readonly sum: number;
}
