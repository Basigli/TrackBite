import { z } from "zod";

export interface Diet {
  _id: string, 
  name: string,
  caloriesAmount: number,
  userId: string
}

export const DietSchemaZ = z.object({
  _id: z.string().optional(),
  name: z.string(),
  caloriesAmount: z.number(),
  userId: z.string()
}).partial();