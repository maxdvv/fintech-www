import { ApiProperty } from "@nestjs/swagger";

export class UserBonusResponseDto {
  @ApiProperty()
  userId: string;

  @ApiProperty()
  userName: string;

  @ApiProperty()
  email: string;

  @ApiProperty()
  bonus: number;
}
