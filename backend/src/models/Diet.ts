import { z } from "zod";
import { Nutrient, NutrientSchemaZ } from "./Nutrient";

export interface Diet {
  _id: string, 
  name: string,
  caloriesAmount: number,
  macros: Array<Nutrient>,
  userId: string
}
  
export const DietSchemaZ = z.object({
  _id: z.string().optional(),
  name: z.string(),
  caloriesAmount: z.number(),
  macros: z.array(NutrientSchemaZ),
  userId: z.string()
}).partial();