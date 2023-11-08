import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";

@Schema()
export class InvitationCodes {
  @Prop({ unique: true })
  investorInvitationCode: string;

  @Prop()
  userId: string;
}

export const InvitationCodesSchema = SchemaFactory.createForClass(InvitationCodes);
