import { FoodItem, FoodItemSchemaZ } from "./FoodItem";
import { z } from "zod";
import { Nutrient, NutrientSchemaZ } from "./Nutrient";

export interface Recipe {
  _id: string, 
  name: string,
  ingredients: Array<FoodItem>,
  description: string,
  userId: string,
  userName: string,
  // image?: Buffer,
  createdAt: Date,
  grade: string,
  macros: Array<Nutrient>, 
  totalCalories: number
}

export const RecipeSchemaZ = z.object({
  _id: z.string().optional(),
  name: z.string(),
  ingredients: z.array(FoodItemSchemaZ),
  userId: z.string(),
  userName: z.string(),
  description: z.string(),
  // image: z.any().optional(),
  createdAt: z.coerce.date(),
  grade: z.string(),
  macros: z.array(NutrientSchemaZ),
  totalCalories: z.number()
});