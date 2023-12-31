import { Injectable, UnauthorizedException } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { User } from "./schemas/user.schema";
import { Model } from "mongoose";
import * as bcrypt from 'bcrypt'
import { LoginDto } from "./dto/login.dto";
import { UserRole } from "./role.enum";
import { SignUpDto } from "./dto/signup.dto";
import { LoginResponseDto } from "./response/login-response.dto";
import { SignupResponseDto } from "./response/signup-response.dto";

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name) private userModel: Model<User>
  ) {}

  async signUp(signUpDto: SignUpDto): Promise<SignupResponseDto> {
    const { username, password, email } = signUpDto;
    const invitationCode = signUpDto?.invitationCode;
    const hashedPassword = await bcrypt.hash(password, 11);
    const isAdminExist = !!(await this.userModel.findOne({ isAdmin: true }));

    const user = await this.userModel.create({
      username,
      password: hashedPassword,
      email,
      isAdmin: !isAdminExist,
      isInvited: !!invitationCode,
      role: isAdminExist ? UserRole.USER : UserRole.ADMIN,
      invitationCode
    });

    if (!user) {
      throw new UnauthorizedException('Registered error!');
    }

    return {
      ...user as User,
      status: 'SUCCESS',
      message: 'User successfully registered',
    }
  }

  async login(session, loginDto: LoginDto): Promise<LoginResponseDto> {
    const { username, password } = loginDto;
    const user = await this.userModel.findOne({ username });

    if (!user) {
      throw new UnauthorizedException('Invalid username or password');
    }

    const isPasswordMatched = await bcrypt.compare(password, user.password);

    if (isPasswordMatched) {
      session.user = user.username;
      session.role = user.role;
      session.autorized = true;
    } else {
      throw new UnauthorizedException('Invalid password');
    }

    return {
      userId: user._id.toString(),
      userName: user.username
    };
  }

  async findUserById(id: string): Promise<User> {
    const user = await this.userModel.findOne({ _id: id });

    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    return user;
  }

  async validateUser(username: string, password: string): Promise<boolean> {
    const user = await this.userModel.findOne({ username });
    return user && user.password === password;
  }
}
