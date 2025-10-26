import { FoodItem, FoodItemSchemaZ } from "./FoodItem";
import { Nutrient, NutrientSchemaZ } from "./Nutrient";
import { z } from "zod";

export interface DailyIntake {
  _id: string
  totalCalories: number, 
  totalMacros: Array<Nutrient>,
  foodItems: Array<FoodItem>
  date: Date
  userId: string
}

export const DailyIntakeSchema = z.object({
  _id: z.string().optional(),
  totalCalories: z.number(),
  totalMacros: z.array(NutrientSchemaZ),
  foodItems: z.array(FoodItemSchemaZ),
  date: z.date(),
  userId: z.string()
});