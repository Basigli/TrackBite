import { FoodItem, FoodItemSchemaZ } from "./FoodItem";
import { z } from "zod";

export interface Recipe {
  _id: string, 
  name: string,
  ingredients: Array<FoodItem>,
  userId: string
}

export const RecipeSchemaZ = z.object({
  _id: z.string().optional(),
  name: z.string(),
  ingredients: z.array(FoodItemSchemaZ),
  userId: z.string()
});