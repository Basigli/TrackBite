import mongoose, { Schema } from "mongoose";
import { RecipeRating } from "../models/RecipeRating";

export const RecipeRatingSchema: Schema<RecipeRating> = new Schema(
  {
    overallRating: { type: String, enum: ['A', 'B', 'C', 'D', 'E'], required: true },
    score: { type: Number, required: true },
    ingredientsScore: { type: Number, required: true },
    cookingMethodScore: { type: Number, required: true },
    reasoning: { type: String, required: true },
    healthImpact: { type: String, required: true },
    recommendations: { type: [String], required: true }
  }
);

export const RecipeRatingModel = mongoose.model<RecipeRating>("RecipeRating", RecipeRatingSchema);