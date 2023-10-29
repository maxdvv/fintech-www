import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MongooseModule } from "@nestjs/mongoose";
import { AuthModule } from "./auth/auth.module";

const MONGODB_CONNECTION = 'mongodb+srv://doz780121:L36TnRYMsUAtmxN9@cluster0.c4afcyf.mongodb.net/?retryWrites=true&w=majority';

@Module({
  imports: [
    MongooseModule.forRoot(MONGODB_CONNECTION),
    AuthModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
