import mongoose, { Schema, Model } from "mongoose";
import { FoodItem } from "../models/FoodItem";
import { ScannedItemSchema } from "./ScannedItemSchema";

export const FoodItemSchema: Schema<FoodItem> = new Schema({
  scannedItem: { type: ScannedItemSchema, required: true },
  percentage: { type: Number, required: true },
});

export const FoodItemModel = mongoose.model<FoodItem>('FoodItem', FoodItemSchema);
