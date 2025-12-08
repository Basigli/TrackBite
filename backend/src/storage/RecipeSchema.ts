import mongoose, { Schema, Model } from "mongoose";
import { FoodItemSchema } from "./FoodItemSchema";
import { Recipe } from "../models/Recipe";
import { NutrientSchema } from "./NutrientSchema";

const RecipeSchema = new Schema<Recipe>({
  name: { type: String, required: true, unique: true },
  ingredients: {
    type: [FoodItemSchema],
    required: true
  },
  ownerId: { type: String, required: true },
  description: { type: String, required: true },
  // image: { type: Buffer, required: false },
  createdAt: { type: Date, required: true },
  grade: { type: String, required: true },
  macros: {
    type: [NutrientSchema],
    required: true
  }
});

export const RecipeModel: Model<Recipe> = mongoose.model<Recipe>("Recipe", RecipeSchema);
