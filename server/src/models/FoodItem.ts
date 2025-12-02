import { z } from "zod";

export interface FoodItem {
  _id?: string, 
  name: string,
  quantity: string,
  calories: number,
  allergens: Array<string>,
  ingredients: Array<string>,
  nutrients:  Map<string, string>,
  macros: Map<string, string>
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
  nutrients: z.record(z.string(), z.string()),
  macros: z.record(z.string(), z.string()),
  score: z.number(),
  grade: z.string(),
  nutrientLevels: z.record(z.string(), z.string())
});