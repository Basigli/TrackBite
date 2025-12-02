import mongoose, { Schema, Model } from "mongoose";
import { FoodItem } from "../models/FoodItem";
import { ScannedItemSchema } from "./ScannedItemSchema";

export const FoodItemSchema: Schema<FoodItem> = new Schema({
  name: { type: String, required: true },
  quantity: { type: String, required: true },
  calories: { type: Number, required: true },
  allergens: { type: [String], default: [] },
  ingredients: { type: [String], default: [] },
  nutrients: { type: Map, of: String },
  macros: { type: Map, of: String },
  score: { type: Number },
  grade: { type: String },
  nutrientLevels: { type: Map, of: String }
});

export const FoodItemModel = mongoose.model<FoodItem>('FoodItem', FoodItemSchema);
