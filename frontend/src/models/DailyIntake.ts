import type { FoodItem } from "./FoodItem";
import { FoodItemSchemaZ } from "./FoodItem";
import type { Nutrient } from "./Nutrient";
import { NutrientSchemaZ } from "./Nutrient";
import { z } from "zod";

export interface DailyIntake {
  _id: string
  totalCalories: number,
  totalMacros: Array<Nutrient>,
  foodItems: Array<FoodItem>,
  date: string,
  userId: string
}

export const DailyIntakeSchemaZ = z.object({
  _id: z.string().optional(),
  totalCalories: z.number(),
  totalMacros: z.array(NutrientSchemaZ),
  foodItems: z.array(FoodItemSchemaZ),
  date: z.string(),
  userId: z.string()
});