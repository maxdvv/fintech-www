import { Injectable, UnauthorizedException } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { User } from "./schemas/user.schema";
import { Model } from "mongoose";
import * as bcrypt from 'bcrypt'
import { LoginDto } from "./dto/login.dto";

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name) private userModel: Model<User>
  ) {}

  async signUp(signUpDto): Promise<User> {
    const { username, password, email } = signUpDto;
    const invitationCode = signUpDto?.invitationCode;
    const hashedPassword = await bcrypt.hash(password, 11);
    const user = await this.userModel.create({
      username,
      password: hashedPassword,
      email,
      isAdmin: false,
      isInvited: !!invitationCode,
      invitationCode
    });

    if (!user) {
      throw new UnauthorizedException('Registered error!');
    }

    return user;
  }

  async login(session, loginDto: LoginDto): Promise<User> {
    const { username, password } = loginDto;
    const user = await this.userModel.findOne({ username });

    if (!user) {
      throw new UnauthorizedException('Invalid username or password');
    }

    const isPasswordMatched = await bcrypt.compare(password, user.password);

    if (isPasswordMatched) {
      session.user = user.username;
      session.autorized = true;
    } else {
      throw new UnauthorizedException('Invalid password');
    }

    return user;
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
