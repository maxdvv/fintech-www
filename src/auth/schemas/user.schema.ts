import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";

@Schema({
  timestamps: true
})
export class User {
  @Prop()
  username: string

  @Prop()
  password: string;

  @Prop({ unique: [true, 'Duplicate email entered'] })
  email: string;

  @Prop()
  isAdmin: boolean;

  @Prop()
  isInvited: boolean;

  @Prop()
  invitationCode: string;
}

export const UserSchema = SchemaFactory.createForClass(User);
