import { z } from "zod";

export interface RecipeRating {
  overallRating: 'A' | 'B' | 'C' | 'D' | 'E';
  score: number; // 0-100
  ingredientsScore: number;
  cookingMethodScore: number;
  reasoning: string;
  healthImpact: string;
  recommendations: string[];
}

export const RecipeRatingSchemaZ = z.object({
  overallRating: z.enum(['A', 'B', 'C', 'D', 'E']),
  score: z.number().min(0).max(100),
  ingredientsScore: z.number().min(0).max(100),
  cookingMethodScore: z.number().min(0).max(100),
  reasoning: z.string(),
  healthImpact: z.string(),
  recommendations: z.array(z.string())
});