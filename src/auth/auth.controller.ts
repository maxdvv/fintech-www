import { Body, Controller, Get, Post, Res, Session, UsePipes, ValidationPipe } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { SignUpDto } from "./dto/signup.dto";
import { LoginDto } from "./dto/login.dto";
import { ApiBody, ApiResponse, ApiTags } from "@nestjs/swagger";

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('signup')
  @UsePipes(new ValidationPipe())
  @ApiBody({ type: SignUpDto })
  @ApiResponse({ status: 201, description: 'The user has been successfully registered.', type: SignUpDto })
  @ApiResponse({ status: 400, description: 'Bad Request'})
  signUp(@Body() signUpDto: SignUpDto) {
    return this.authService.signUp(signUpDto);
  }

  @Post('login')
  @ApiBody({ type: LoginDto })
  @ApiResponse({ status: 201, description: 'The user has been successfully login.', type: SignUpDto })
  @ApiResponse({ status: 401, description: 'Invalid username or password.' })
  login(@Session() session, @Body() loginDto: LoginDto) {
    return this.authService.login(session, loginDto);
  }

  @Get('logout')
  @ApiResponse({ status: 201, description: 'The user has been successfully logout.' })
  logout(@Session() session, @Res() res) {
    session.destroy();
    res.redirect('/');
    return {};
  }
}
