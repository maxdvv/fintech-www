import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";

@Schema({
  timestamps: true
})
export class Withdrawal {
  @Prop()
  userId: string;

  @Prop()
  investmentId: string;

  @Prop()
  createdAt: Date;

  @Prop()
  updatedAt: Date;

  @Prop()
  category: string;

  @Prop()
  sum: number;
}

export const withdrawalSchema = SchemaFactory.createForClass(Withdrawal);
