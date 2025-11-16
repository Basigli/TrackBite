import mongoose, { Schema, Model } from "mongoose";
import { FoodItemSchema } from "./FoodItemSchema";
import { Recipe } from "../models/Recipe";

const RecipeSchema = new Schema<Recipe>({
  name: { type: String, required: true, unique: true },
  ingredients: {
    type: [FoodItemSchema],
    required: true
  },
  userId: { type: String, required: true }
});

export const RecipeModel: Model<Recipe> = mongoose.model<Recipe>("Recipe", RecipeSchema);
