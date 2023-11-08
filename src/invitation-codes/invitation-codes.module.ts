import { Module } from '@nestjs/common';
import { InvitationCodesController } from './invitation-codes.controller';
import { InvitationCodesService } from './invitation-codes.service';
import { MongooseModule } from "@nestjs/mongoose";
import { UserSchema } from "../auth/schemas/user.schema";
import { InvitationCodesSchema } from "./schemas/invitation-codes.schema";

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: 'InvitationCodes', schema: InvitationCodesSchema },
      { name: 'User', schema: UserSchema }
    ])
  ],
  controllers: [InvitationCodesController],
  providers: [InvitationCodesService]
})
export class InvitationCodesModule {}
