import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MongooseModule } from "@nestjs/mongoose";
import { AuthModule } from "./auth/auth.module";
import { InvestmentModule } from './investment/investment.module';
import { ConfigModule } from "@nestjs/config";
import { InvitationCodesModule } from './invitation-codes/invitation-codes.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: '.env',
      isGlobal: true
    }),
    MongooseModule.forRoot(process.env.MONGODB_CONNECTION),
    AuthModule,
    InvestmentModule,
    InvitationCodesModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {
}
