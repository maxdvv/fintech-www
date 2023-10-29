import { Module } from "@nestjs/common";
import { AuthController } from "./auth.controller";
import { AuthService } from './auth.service';
import { PassportModule } from "@nestjs/passport";
import { MongooseModule } from "@nestjs/mongoose";
import { UserSchema } from "./schemas/user.schema";
import { LocalStrategy } from "./local.strategy";

@Module({
  imports: [
    PassportModule.register({ defaultStrategy: 'local'}),
    MongooseModule.forFeature([{ name: 'User', schema: UserSchema }])
  ],
  controllers: [AuthController],
  providers: [AuthService, LocalStrategy],
  exports: [LocalStrategy, PassportModule]
})

export class AuthModule {}
