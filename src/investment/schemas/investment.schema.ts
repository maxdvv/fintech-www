import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";

@Schema({
  timestamps: true
})
export class Investment {
  @Prop()
  amount: number;

  @Prop()
  userId: string;
}

export const investmentSchema = SchemaFactory.createForClass(Investment);
