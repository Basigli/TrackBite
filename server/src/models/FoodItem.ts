import { ScannedItem } from "./ScannedItem";
import { z } from "zod";
import { ScannedItemSchemaZ } from "./ScannedItem";

export interface FoodItem {
  _id: string, 
  scannedItem: ScannedItem, 
  percentage: number,
  // dailyIntakeId?: string
  // recipeId?: string
}

export const FoodItemSchemaZ = z.object({
  _id: z.string().optional(),
  scannedItem: ScannedItemSchemaZ,
  percentage: z.number(),
  // dailyIntakeId: z.string().optional(),
  // recipeId: z.string().optional()
});