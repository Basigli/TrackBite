import { GoogleGenerativeAI } from '@google/generative-ai';
import { Recipe } from '../models/Recipe';

interface RecipeRatingResponse {
  overallRating: 'A' | 'B' | 'C' | 'D' | 'E';
  score: number; // 0-100
  ingredientsScore: number;
  cookingMethodScore: number;
  reasoning: string;
  healthImpact: string;
  recommendations: string[];
}

export class RecipeRatingService {
  private genAI: GoogleGenerativeAI;
  private model: any;

  constructor(apiKey: string) {
    this.genAI = new GoogleGenerativeAI(apiKey);
    this.model = this.genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });
  }

  /**
   * Rate a recipe based on ingredients and cooking method
   */
  async rateRecipe(recipe: Recipe): Promise<RecipeRatingResponse> {
    const prompt = this.buildPrompt(recipe);

    try {
      const result = await this.model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();

      return this.parseResponse(text);
    } catch (error) {
      console.error('Error calling Gemini API:', error);
      throw new Error('Failed to rate recipe');
    }
  }

  /**
   * Build the prompt for Gemini
   */
  private buildPrompt(recipe: Recipe): string {
    const ingredientsList = recipe.ingredients
      .map(ing => `- ${ing.name}: Grade ${ing.grade} (Nutrition Score: ${ing.score}/100)`)
      .join('\n');

    const macrosList = recipe.macros
      .map(macro => `- ${macro.name}: ${macro.totalAmount}${macro.unit}`)
      .join('\n');

    return `You are a nutrition expert evaluating recipes based on both ingredient quality and cooking methods.

Recipe Name: ${recipe.name}

Ingredients with their individual ratings:
${ingredientsList}

Total Calories: ${recipe.totalCalories} kcal

Macros:
${macrosList}

Description: ${recipe.description}
Cooking Method: (inferred from description and ingredients)

Using the above information, provide a comprehensive rating for the recipe considering the following criteria:
IMPORTANT EVALUATION CRITERIA:
1. Ingredient Quality (40% weight):
   - Consider the nutrition scores and grades of individual ingredients
   - A-grade ingredients are excellent, E-grade are poor
   - Look at the overall ingredient quality distribution

2. Cooking Method Impact (60% weight):
   - Analyze the description and ingredient list to infer cooking method
   - Frying, deep-frying: Significantly negative impact (adds unhealthy fats, reduces nutrients)
   - Grilling, roasting: Moderate impact (some nutrient loss, potential carcinogens)
   - Steaming, boiling: Minimal negative impact
   - Raw/fresh: Positive impact (preserves nutrients)
   - Baking: Moderate impact (depends on added fats/sugars)

3. Overall Health Impact:
   - Even if ingredients are healthy, unhealthy cooking methods should lower the rating
   - Example: Fried potatoes should get a lower rating than boiled potatoes, even though both use the same ingredient
   - Consider macro balance (protein, carbs, fats)
   - Consider total calorie count relative to typical meal sizes

Please provide your response in the following JSON format:
{
  "overallRating": "A/B/C/D/E",
  "score": 0-100,
  "ingredientsScore": 0-100,
  "cookingMethodScore": 0-100,
  "reasoning": "Brief explanation of the rating",
  "healthImpact": "Description of health implications",
  "recommendations": ["suggestion 1", "suggestion 2", "suggestion 3"]
}
Be concise, don't write long recommendations.
Be strict with ratings. Unhealthy cooking methods should significantly impact the final score.`;
  }

  /**
   * Parse the Gemini response
   */
  private parseResponse(text: string): RecipeRatingResponse {
    try {
      // Extract JSON from the response (Gemini might wrap it in markdown)
      const jsonMatch = text.match(/\{[\s\S]*\}/);
      if (!jsonMatch) {
        throw new Error('No JSON found in response');
      }

      const parsed = JSON.parse(jsonMatch[0]);

      return {
        overallRating: parsed.overallRating,
        score: parsed.score,
        ingredientsScore: parsed.ingredientsScore,
        cookingMethodScore: parsed.cookingMethodScore,
        reasoning: parsed.reasoning,
        healthImpact: parsed.healthImpact,
        recommendations: parsed.recommendations || []
      };
    } catch (error) {
      console.error('Error parsing response:', error);
      console.log('Raw response:', text);
      
      // Fallback response
      return {
        overallRating: 'C',
        score: 50,
        ingredientsScore: 50,
        cookingMethodScore: 50,
        reasoning: 'Unable to parse detailed rating',
        healthImpact: 'Unable to determine',
        recommendations: []
      };
    }
  }

  /**
   * Rate multiple recipes in batch
   */
  async rateRecipes(recipes: Recipe[]): Promise<RecipeRatingResponse[]> {
    const promises = recipes.map(recipe => this.rateRecipe(recipe));
    return Promise.all(promises);
  }
}

// Export for use in other modules
export { RecipeRatingResponse };