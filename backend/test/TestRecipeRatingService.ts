import dotenv from 'dotenv';
import { RecipeRatingService, RecipeRatingRequest } from '../src/utils/RecipeRatingService';
dotenv.config();
export async function exampleUsage() {
    const apiKey = process.env.GEMINI_API_KEY || 'your-api-key-here'; // Replace with your API key
    console.log('Using GEMINI_API_KEY:', apiKey);
    const ratingService = new RecipeRatingService(apiKey);

    // Example 1: Fried Potatoes (should get low rating despite good ingredient)
    const friedPotatoes: RecipeRatingRequest = {
        recipeName: 'Fried Potatoes',
        ingredients: [
            {
            name: 'Potatoes',
            rating: 'A',
            nutritionScore: 85
            },
            {
            name: 'Vegetable Oil',
            rating: 'C',
            nutritionScore: 40
            },
            {
            name: 'Salt',
            rating: 'D',
            nutritionScore: 30
            }
        ],
        description: 'Crispy fried potato slices, golden brown and seasoned with salt.',
        cookingMethod: 'Deep frying in oil at high temperature'
    };

    // Example 2: Steamed Vegetables (should get high rating)
    const steamedVeggies: RecipeRatingRequest = {
        recipeName: 'Steamed Vegetables',
        ingredients: [
            {
            name: 'Broccoli',
            rating: 'A',
            nutritionScore: 95
            },
            {
            name: 'Carrots',
            rating: 'A',
            nutritionScore: 90
            },
            {
            name: 'Zucchini',
            rating: 'A',
            nutritionScore: 88
            }
        ],
        description: 'Fresh vegetables lightly steamed to preserve nutrients.',
        cookingMethod: 'Steaming for 5-7 minutes'
    };

    try {
        console.log('Rating Fried Potatoes...');
        const friedRating = await ratingService.rateRecipe(friedPotatoes);
        console.log('Fried Potatoes Rating:', friedRating);

        console.log('\nRating Steamed Vegetables...');
        const steamedRating = await ratingService.rateRecipe(steamedVeggies);
        console.log('Steamed Vegetables Rating:', steamedRating);
    } catch (error) {
        console.error('Error:', error);
    }
}

exampleUsage();