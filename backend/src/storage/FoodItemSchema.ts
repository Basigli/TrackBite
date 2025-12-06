import mongoose, { Schema, Model } from "mongoose";
import { FoodItem } from "../models/FoodItem";
import { NutrientSchema } from "./NutrientSchema";

export const FoodItemSchema: Schema<FoodItem> = new Schema({
  name: { type: String, required: true },
  quantity: { type: String, required: true },
  calories: { type: Number, required: true },
  allergens: { type: [String], default: [] },
  ingredients: { type: [String], default: [] },
  nutrients: { type: [NutrientSchema], default: [] },
  macros: { type: [NutrientSchema], default: [] },
  score: { type: Number },
  grade: { type: String },
  nutrientLevels: { type: Map, of: String }
});

export const FoodItemModel = mongoose.model<FoodItem>('FoodItem', FoodItemSchema);
