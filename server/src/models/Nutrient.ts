import { z } from "zod";

export interface Nutrient {
    _id: string,
    name: string,
    unit: string,
    totalAmount: number,
    amount100g: number,
    amountPerServing: number,
}

export const NutrientSchemaZ = z.object({
  _id: z.string().optional(),
  name: z.string(),
  unit: z.string(),
  totalAmount: z.number(),
  amount100g: z.number(),
  amountPerServing: z.number(),
  // scannedItemId: z.string()
});