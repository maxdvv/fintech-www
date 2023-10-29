import { IsEmail, IsNotEmpty, IsString, MinLength } from "class-validator";

export class SignUpDto {
  @IsNotEmpty()
  @IsString()
  readonly username: string

  @IsNotEmpty()
  @IsString()
  @MinLength(8)
  readonly password: string;

  @IsNotEmpty()
  @IsEmail({}, { message: 'Please enter correct email' })
  readonly email: string;

  @IsString()
  readonly invitationCode: string;
}
