import { z } from "zod";

export interface UserCredentials {
  _id: string, 
  nickname: string,
  passwordHash: string, 
}

export const UserCredentialsSchemaZ = z.object({
  _id: z.string().optional(),
  nickname: z.string(),
  passwordHash: z.string(),
});
