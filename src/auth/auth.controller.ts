import { Body, Controller, Get, HttpStatus, Post, Req, Res, Session, UsePipes, ValidationPipe } from "@nestjs/common";
import { Request, Response } from 'express';
import { AuthService } from "./auth.service";
import { SignUpDto } from "./dto/signup.dto";
import { LoginDto } from "./dto/login.dto";
import { ApiBody, ApiInternalServerErrorResponse, ApiResponse, ApiTags } from "@nestjs/swagger";
import { LoginResponseDto } from "./response/login-response.dto";
import { LoginErrorDto } from "./response/login-error-dto";
import { LogoutResponseDto } from "./response/logout-response.dto";
import { SignupResponseDto } from "./response/signup-response.dto";

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('signup')
  @UsePipes(new ValidationPipe())
  @ApiBody({ type: SignUpDto })
  @ApiResponse({ status: 201, description: 'The user has been successfully registered.', type: SignupResponseDto })
  @ApiResponse({ status: 400, description: 'Bad Request'})
  @ApiInternalServerErrorResponse({ description: 'Internal server error' })
  signUp(@Body() signUpDto: SignUpDto): Promise<SignupResponseDto> {
    return this.authService.signUp(signUpDto);
  }

  @Post('login')
  @ApiBody({ type: LoginDto })
  @ApiResponse({ status: 201, description: 'The user has been successfully login', type: LoginResponseDto })
  @ApiResponse({ status: 401, description: 'Invalid username or password', type: LoginErrorDto })
  @ApiInternalServerErrorResponse({ description: 'Internal server error' })
  login(@Session() session, @Body() loginDto: LoginDto): Promise<LoginResponseDto> {
    return this.authService.login(session, loginDto);
  }

  @Get('logout')
  @ApiResponse({ status: 200, description: 'The user has been successfully logout.', type: LogoutResponseDto })
  @ApiInternalServerErrorResponse({ description: 'Internal server error' })
  logout(@Session() session, @Res() res: Response, @Req() req: Request): LogoutResponseDto {
    return session.destroy((err) => {
      if (err) {
        console.error('Error destroying session:', err);
        return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
          status: 'ERROR',
          message: 'Error during logout',
          statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        });
      }

      res.clearCookie('connect.sid');

      res.status(200).json({
        status: 'SUCCESS',
        message: 'Successfully logged out',
        statusCode: HttpStatus.OK,
      });
    });
  }
}
