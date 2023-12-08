import { ApiProperty } from "@nestjs/swagger";

export class SignupResponseDto {
  @ApiProperty()
  status: string;

  @ApiProperty()
  message: string;

  @ApiProperty()
  username: string;

  @ApiProperty()
  password: string;

  @ApiProperty()
  email: string;

  @ApiProperty()
  isAdmin: boolean;

  @ApiProperty()
  isInvited: boolean;

  @ApiProperty()
  role: string;

  @ApiProperty()
  invitationCode: string;
}
