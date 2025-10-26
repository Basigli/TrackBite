import mongoose, { Schema, Model } from "mongoose";
import { DailyIntake } from "../models/DailyIntake";
import { NutrientSchema } from "./NutrientSchema";
import { FoodItemSchema } from "./FoodItemSchema";

const DailyIntakeSchema: Schema<DailyIntake> = new Schema({
  totalCalories: { type: Number, required: true },
  totalMacros: { type: [NutrientSchema], default: [] },
  foodItems: { type: [FoodItemSchema], default: [] },
  date: { type: String, required: true },
  userId: { type: String, required: true }
});

DailyIntakeSchema.index({ userId: 1 });

export const DailyIntakeModel = mongoose.model<DailyIntake>('DailyIntake', DailyIntakeSchema);
