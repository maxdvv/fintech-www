import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { User } from "../auth/schemas/user.schema";
import { InvitationCodes } from "./schemas/invitation-codes.schema";
import { generateInvitationCode } from "../common/functions/generate-invitation-code";

@Injectable()
export class InvitationCodesService {
  constructor(
    @InjectModel(User.name) private userModel: Model<User>,
    @InjectModel(InvitationCodes.name) private invitationCodesModel: Model<InvitationCodes>
  ) {}

  async getInvitationCodeById(userId: string): Promise<InvitationCodes> {
    const findCode = await this.invitationCodesModel.findOne({ userId });

    let createdCode;
    if(!findCode) {
      const invitations = await this.invitationCodesModel.find().exec();
      const invitationCodes = invitations.map(invitation => invitation.investorInvitationCode);
      let investorInvitationCode = generateInvitationCode();

      while (invitationCodes.includes(investorInvitationCode)) {
        investorInvitationCode = generateInvitationCode();
      }

      createdCode = await this.invitationCodesModel.create(
        { userId, investorInvitationCode }
      );
    }

    if (!createdCode) {
      console.error('Create invitation code error');
    }

    return findCode || createdCode;
  }
}
