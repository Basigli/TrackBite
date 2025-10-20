import mongoose, { Schema, Model } from "mongoose";
import { Nutrient } from "../models/Nutrient";

export const NutrientSchema = new Schema<Nutrient>({
  id: { type: Number }, // optional field
  name: { type: String, required: true },
  unit: { type: String, required: true },
  totalAmount: { type: Number, required: true },
  amount100g: { type: Number, required: true }
});

export const NutrientModel: Model<Nutrient> = mongoose.model<Nutrient>(
  "Nutrient",
  NutrientSchema
);