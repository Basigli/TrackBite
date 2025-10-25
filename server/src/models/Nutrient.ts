import { z } from "zod";

export interface Nutrient {
    _id: string,
    name: string,
    unit: string,
    totalAmount: number
    amount100g: number
}

export const NutrientSchemaZ = z.object({
  _id: z.string(),
  name: z.string(),
  unit: z.string(),
  totalAmount: z.number(),
  amount100g: z.number(),
});