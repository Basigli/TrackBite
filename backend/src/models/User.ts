import { z } from "zod";

export interface User {
  _id: string,
  nickname: string,
  mail: string,
  savedRecipesIds: Array<string>,
  savedScannedItemsIds: Array<string>,
}

export const UserSchemaZ = z.object({
  _id: z.string().optional(),
  nickname: z.string(),
  mail: z.string().email(),
  savedRecipesIds: z.array(z.string()),
  savedScannedItemsIds: z.array(z.string()),
}).partial();