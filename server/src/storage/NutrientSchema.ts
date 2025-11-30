import mongoose, { Schema } from "mongoose";
import { Nutrient } from "../models/Nutrient";

export const NutrientSchema: Schema<Nutrient> = new Schema(
  {
    // Remove _id field definition entirely - let Mongoose auto-generate
    name: { type: String, required: true },
    unit: { type: String, required: true },
    totalAmount: { type: Number, required: true },
    amount100g: { type: Number, required: true }
  },
  { _id: true } // Enable auto _id generation for subdocuments
);

export const NutrientModel = mongoose.model<Nutrient>("Nutrient", NutrientSchema);