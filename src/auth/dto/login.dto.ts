import { IsNotEmpty, IsString, MinLength } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class LoginDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  readonly username: string

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  @MinLength(8)
  readonly password: string;
}
