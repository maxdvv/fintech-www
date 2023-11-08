import { IsNotEmpty, IsString } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class invitationCodesDto {
  @ApiProperty({ required: true, uniqueItems: true })
  @IsNotEmpty()
  @IsString()
  readonly investorInvitationCode: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  readonly userId: string;
}
