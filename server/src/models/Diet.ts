import { z } from "zod";

export interface Diet {
  _id: string, 
  name: string,
  caloriesAmount: number, 
}

export const DietSchemaZ = z.object({
  _id: z.string(),
  name: z.string(),
  caloriesAmount: z.number(),
});