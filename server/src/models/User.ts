import { z } from "zod";

export interface User {
  _id: string,
  nickname: string,
  mail: string
}

export const UserSchemaZ = z.object({
  _id: z.string().optional(),
  nickname: z.string(),
  mail: z.string().email(),
});