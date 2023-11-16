import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";

@Schema({
  timestamps: true
})
export class Investment {
  @Prop()
  userId: string;

  @Prop()
  createdAt: Date;

  @Prop()
  updatedAt: Date;

  @Prop()
  deposit: number;

  @Prop()
  profit: number;

  @Prop()
  bonus: number;

  @Prop()
  availableProfit: number;

  @Prop()
  availableBonus: number;
}

export const investmentSchema = SchemaFactory.createForClass(Investment);
