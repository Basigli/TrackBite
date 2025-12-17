import { z } from "zod";
import type { Nutrient } from "./Nutrient";
import { NutrientSchemaZ } from "./Nutrient";

export interface FoodItem {
  _id?: string, 
  name: string,
  quantity: string,
  calories: number,
  allergens: Array<string>,
  ingredients: Array<string>,
  nutrients:  Array<Nutrient>,
  macros: Array<Nutrient>,
  score: number,
  grade: string,
  nutrientLevels: Map<string, string>
}

export const FoodItemSchemaZ = z.object({
  _id: z.string().optional(),
  name: z.string(),
  quantity: z.string(),
  calories: z.number(),
  allergens: z.array(z.string()),
  ingredients: z.array(z.string()),
  nutrients: z.array(NutrientSchemaZ),
  macros: z.array(NutrientSchemaZ),
  score: z.number(),
  grade: z.string(),
  nutrientLevels: z.record(z.string(), z.string())
});