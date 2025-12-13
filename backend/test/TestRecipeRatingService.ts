import dotenv from 'dotenv';
import { RecipeRatingService } from '../src/utils/RecipeRatingService';
import { Recipe } from '../src/models/Recipe';
import { FoodItem } from '../src/models/FoodItem';
import { Nutrient } from '../src/models/Nutrient';

dotenv.config();

export async function exampleUsage() {
    const apiKey = process.env.GEMINI_API_KEY;
    
    if (!apiKey) {
        throw new Error('GEMINI_API_KEY is not set in environment variables');
    }
    
    console.log('Using GEMINI_API_KEY:', apiKey.substring(0, 10) + '...');
    const ratingService = new RecipeRatingService(apiKey);

    // Helper function to create nutrients
    const createNutrient = (name: string, totalAmount: number, unit: string): Nutrient => ({
        _id: `nutrient-${name.toLowerCase().replace(/\s+/g, '-')}`,
        name,
        unit,
        totalAmount,
        amount100g: totalAmount,
        amountPerServing: totalAmount,
    });

    // Helper function to create macros (macros are also nutrients)
    const createMacro = (name: string, totalAmount: number, unit: string): Nutrient => ({
        _id: `macro-${name.toLowerCase()}`,
        name,
        unit,
        totalAmount,
        amount100g: totalAmount,
        amountPerServing: totalAmount,
    });

    // Example 1: Fried Potatoes (should get low rating despite decent ingredients)
    const potatoesItem: FoodItem = {
        name: 'Potatoes',
        quantity: '200g',
        calories: 154,
        allergens: [],
        ingredients: ['potatoes'],
        nutrients: [
            createNutrient('Vitamin C', 19.7, 'mg'),
            createNutrient('Potassium', 425, 'mg')
        ],
        macros: [
            createMacro('Carbohydrates', 35, 'g'),
            createMacro('Protein', 4, 'g'),
            createMacro('Fat', 0.2, 'g')
        ],
        score: 75,
        grade: 'B',
        nutrientLevels: new Map([['sodium', 'low'], ['fiber', 'moderate']])
    };

    const vegetableOilItem: FoodItem = {
        name: 'Vegetable Oil',
        quantity: '30g',
        calories: 265,
        allergens: [],
        ingredients: ['vegetable oil'],
        nutrients: [],
        macros: [
            createMacro('Fat', 30, 'g')
        ],
        score: 35,
        grade: 'D',
        nutrientLevels: new Map([['saturated-fat', 'high']])
    };

    const saltItem: FoodItem = {
        name: 'Salt',
        quantity: '2g',
        calories: 0,
        allergens: [],
        ingredients: ['salt'],
        nutrients: [
            createNutrient('Sodium', 800, 'mg')
        ],
        macros: [],
        score: 20,
        grade: 'E',
        nutrientLevels: new Map([['sodium', 'very-high']])
    };

    const friedPotatoes: Recipe = {
        _id: 'test-1',
        name: 'Crispy Fried Potatoes',
        description: 'Golden brown potato slices deep fried in vegetable oil until crispy, seasoned with salt.',
        totalCalories: 450,
        userId: 'test-user',
        userName: 'Test Chef',
        grade: 'D',
        ingredients: [potatoesItem, vegetableOilItem, saltItem],
        macros: [
            createMacro('Carbohydrates', 45, 'g'),
            createMacro('Protein', 4, 'g'),
            createMacro('Fat', 25, 'g')
        ],
        createdAt: new Date()
    };

    // Example 2: Steamed Vegetables (should get high rating)
    const broccoliItem: FoodItem = {
        name: 'Broccoli',
        quantity: '100g',
        calories: 34,
        allergens: [],
        ingredients: ['broccoli'],
        nutrients: [
            createNutrient('Vitamin C', 89.2, 'mg'),
            createNutrient('Vitamin K', 101.6, 'mcg'),
            createNutrient('Folate', 63, 'mcg')
        ],
        macros: [
            createMacro('Carbohydrates', 7, 'g'),
            createMacro('Protein', 2.8, 'g'),
            createMacro('Fat', 0.4, 'g')
        ],
        score: 95,
        grade: 'A',
        nutrientLevels: new Map([['sodium', 'low'], ['fiber', 'high']])
    };

    const carrotsItem: FoodItem = {
        name: 'Carrots',
        quantity: '80g',
        calories: 33,
        allergens: [],
        ingredients: ['carrots'],
        nutrients: [
            createNutrient('Vitamin A', 835, 'mcg'),
            createNutrient('Beta Carotene', 8285, 'mcg')
        ],
        macros: [
            createMacro('Carbohydrates', 8, 'g'),
            createMacro('Protein', 0.8, 'g'),
            createMacro('Fat', 0.2, 'g')
        ],
        score: 90,
        grade: 'A',
        nutrientLevels: new Map([['sodium', 'low'], ['fiber', 'moderate']])
    };

    const zucchiniItem: FoodItem = {
        name: 'Zucchini',
        quantity: '80g',
        calories: 14,
        allergens: [],
        ingredients: ['zucchini'],
        nutrients: [
            createNutrient('Vitamin C', 14.4, 'mg'),
            createNutrient('Potassium', 261, 'mg')
        ],
        macros: [
            createMacro('Carbohydrates', 3, 'g'),
            createMacro('Protein', 1.2, 'g'),
            createMacro('Fat', 0.3, 'g')
        ],
        score: 88,
        grade: 'A',
        nutrientLevels: new Map([['sodium', 'low'], ['fiber', 'moderate']])
    };

    const steamedVeggies: Recipe = {
        _id: 'test-2',
        name: 'Steamed Garden Vegetables',
        description: 'Fresh broccoli, carrots, and zucchini lightly steamed to preserve nutrients and natural flavors.',
        totalCalories: 81,
        userId: 'test-user',
        userName: 'Healthy Chef',
        grade: 'A',
        ingredients: [broccoliItem, carrotsItem, zucchiniItem],
        macros: [
            createMacro('Carbohydrates', 18, 'g'),
            createMacro('Protein', 4.8, 'g'),
            createMacro('Fat', 0.9, 'g')
        ],
        createdAt: new Date()
    };

    // Example 3: Grilled Chicken with Quinoa (should get good rating)
    const chickenItem: FoodItem = {
        name: 'Chicken Breast',
        quantity: '150g',
        calories: 248,
        allergens: [],
        ingredients: ['chicken breast'],
        nutrients: [
            createNutrient('Vitamin B6', 0.9, 'mg'),
            createNutrient('Niacin', 14.8, 'mg')
        ],
        macros: [
            createMacro('Protein', 47, 'g'),
            createMacro('Fat', 5.4, 'g'),
            createMacro('Carbohydrates', 0, 'g')
        ],
        score: 92,
        grade: 'A',
        nutrientLevels: new Map([['sodium', 'low'], ['protein', 'very-high']])
    };

    const quinoaItem: FoodItem = {
        name: 'Quinoa',
        quantity: '100g',
        calories: 120,
        allergens: [],
        ingredients: ['quinoa'],
        nutrients: [
            createNutrient('Iron', 1.5, 'mg'),
            createNutrient('Magnesium', 64, 'mg')
        ],
        macros: [
            createMacro('Carbohydrates', 21, 'g'),
            createMacro('Protein', 4.4, 'g'),
            createMacro('Fat', 1.9, 'g')
        ],
        score: 88,
        grade: 'A',
        nutrientLevels: new Map([['fiber', 'high'], ['protein', 'high']])
    };

    const oliveOilItem: FoodItem = {
        name: 'Olive Oil',
        quantity: '10g',
        calories: 88,
        allergens: [],
        ingredients: ['extra virgin olive oil'],
        nutrients: [
            createNutrient('Vitamin E', 1.4, 'mg')
        ],
        macros: [
            createMacro('Fat', 10, 'g')
        ],
        score: 75,
        grade: 'B',
        nutrientLevels: new Map([['saturated-fat', 'low']])
    };

    const grilledChicken: Recipe = {
        _id: 'test-3',
        name: 'Grilled Chicken Breast with Quinoa',
        description: 'Lean chicken breast grilled to perfection, served with fluffy quinoa and a touch of olive oil.',
        totalCalories: 456,
        userId: 'test-user',
        userName: 'Fitness Chef',
        grade: 'A',
        ingredients: [chickenItem, quinoaItem, oliveOilItem],
        macros: [
            createMacro('Carbohydrates', 21, 'g'),
            createMacro('Protein', 51.4, 'g'),
            createMacro('Fat', 17.3, 'g')
        ],
        createdAt: new Date()
    };

    try {
        console.log('\n=== Rating Fried Potatoes ===');
        const friedRating = await ratingService.rateRecipe(friedPotatoes);
        console.log('Overall Rating:', friedRating.overallRating);
        console.log('Score:', friedRating.score);
        console.log('Ingredients Score:', friedRating.ingredientsScore);
        console.log('Cooking Method Score:', friedRating.cookingMethodScore);
        console.log('Reasoning:', friedRating.reasoning);
        console.log('Health Impact:', friedRating.healthImpact);
        console.log('Recommendations:', friedRating.recommendations);

        console.log('\n=== Rating Steamed Vegetables ===');
        const steamedRating = await ratingService.rateRecipe(steamedVeggies);
        console.log('Overall Rating:', steamedRating.overallRating);
        console.log('Score:', steamedRating.score);
        console.log('Ingredients Score:', steamedRating.ingredientsScore);
        console.log('Cooking Method Score:', steamedRating.cookingMethodScore);
        console.log('Reasoning:', steamedRating.reasoning);
        console.log('Health Impact:', steamedRating.healthImpact);
        console.log('Recommendations:', steamedRating.recommendations);

        console.log('\n=== Rating Grilled Chicken with Quinoa ===');
        const chickenRating = await ratingService.rateRecipe(grilledChicken);
        console.log('Overall Rating:', chickenRating.overallRating);
        console.log('Score:', chickenRating.score);
        console.log('Ingredients Score:', chickenRating.ingredientsScore);
        console.log('Cooking Method Score:', chickenRating.cookingMethodScore);
        console.log('Reasoning:', chickenRating.reasoning);
        console.log('Health Impact:', chickenRating.healthImpact);
        console.log('Recommendations:', chickenRating.recommendations);

        console.log('\n=== Summary ===');
        console.log(`Fried Potatoes: ${friedRating.overallRating} (${friedRating.score}/100)`);
        console.log(`Steamed Vegetables: ${steamedRating.overallRating} (${steamedRating.score}/100)`);
        console.log(`Grilled Chicken: ${chickenRating.overallRating} (${chickenRating.score}/100)`);
        
    } catch (error) {
        console.error('Error:', error);
    }
}

exampleUsage();