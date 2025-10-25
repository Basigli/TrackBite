import { ScannedItem } from "./ScannedItem";
import { z } from "zod";
import { ScannedItemSchemaZ } from "./ScannedItem";

export interface FoodItem {
  _id: string, 
  scannedItem: ScannedItem, 
  percentage: number
}

export const FoodItemSchemaZ = z.object({
  _id: z.string(),
  scannedItem: ScannedItemSchemaZ,
  percentage: z.number(),
});