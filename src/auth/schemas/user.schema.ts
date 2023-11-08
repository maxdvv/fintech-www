import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { UserRole } from "../role.enum";

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

  @Prop({ enum: UserRole, default: UserRole.USER })
  role: string

  @Prop({ unique: false })
  invitationCode: string;
}

export const UserSchema = SchemaFactory.createForClass(User);
