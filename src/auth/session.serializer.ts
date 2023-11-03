import { Injectable } from "@nestjs/common"
import { PassportSerializer } from "@nestjs/passport"
import { AuthService } from "./auth.service";

@Injectable()
export class SessionSerializer extends PassportSerializer {
  constructor(private authService: AuthService) {
    super();
  }

  serializeUser(user: any, done: (err: Error, user: any) => void): void {
    done(null, user.id);
  }

  deserializeUser(user: any, done: (err: Error, user: any) => void): void {
    const foundUser = this.authService.findUserById(user.id);

    if (!foundUser) {
      return done(new Error('User not found'), null);
    }

    done(null, foundUser);
  }
}
