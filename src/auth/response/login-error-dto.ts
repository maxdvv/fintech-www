import { ApiProperty } from "@nestjs/swagger";

export class LoginErrorDto {
  @ApiProperty()
  error: string;

  @ApiProperty()
  message: string;

  @ApiProperty()
  statusCode: number = 401;
}
