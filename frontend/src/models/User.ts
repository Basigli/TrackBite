import { z } from "zod";
import { Recipe } from "./Recipe";
import { Diet } from "./Diet";

export interface User {
  _id: string,
  nickname: string,
  mail: string,
  savedRecipesIds: Array<string>,
  // diets: Array<Diet>
}

export const UserSchemaZ = z.object({
  _id: z.string().optional(),
  nickname: z.string(),
  mail: z.string().email(),
  savedRecipesIds: z.array(z.string()),
  // diets: z.array(DietSchemaZ)
});