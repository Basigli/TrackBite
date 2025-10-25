import { NutrientSchemaZ } from "../models/Nutrient";
import { Nutrient } from "./Nutrient";
import { z } from "zod";

export interface ScannedItem {
  _id: string, 
  name: string, 
  allergens: Array<string>,
  nutrients: Array<Nutrient>,
  ingredients: Array<string>,
  score: number,
  grade: string,
  nutrientLevels: Map<string, string>
}

export const ScannedItemSchemaZ = z.object({
  _id: z.string().optional(),
  name: z.string(),
  allergens: z.array(z.string()),
  nutrients: z.array(NutrientSchemaZ),
  ingredients: z.array(z.string()),
  score: z.number(),
  grade: z.string(),
  nutrientLevels: z.record(z.string(), z.string())
});
