import mongoose, { Schema, Model } from "mongoose";
import { ScannedItem } from "../models/ScannedItem";
import { NutrientSchema } from "./nutrientSchema";

export const ScannedItemSchema: Schema<ScannedItem> = new Schema({
  name: { type: String, required: true },
  allergens: { type: [NutrientSchema], default: [] },
  nutrients: { type: [NutrientSchema], default: [] },
  ingredients: { type: [String], default: [] },
  score: { type: Number },
  grade: { type: String },
  nutrientLevels: { type: Map, of: String },
});

export const ScannedItemModel = mongoose.model<ScannedItem>('ScannedItem', ScannedItemSchema);
