import { ApiProperty } from "@nestjs/swagger";

export class LoginResponseDto {
  @ApiProperty()
  userId: string;

  @ApiProperty()
  userName: string;
}
