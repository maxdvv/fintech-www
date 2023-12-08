import { ApiProperty } from "@nestjs/swagger";

export class LogoutResponseDto {
  @ApiProperty()
  status: string;

  @ApiProperty()
  message: string;

  @ApiProperty()
  statusCode: number = 200;
}
