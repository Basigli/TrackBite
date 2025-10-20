import mongoose from "mongoose";
import { NutrientModel } from "../src/storage/NutrientSchema";
import { RecipeModel } from "../src/storage/RecipeSchema";
import { DailyIntakeModel } from "../src/storage/DailyIntakeSchema";
import { DietModel } from "../src/storage/DietSchema";

async function runTests() {
  try {
    // 1. Connect to MongoDB
    await mongoose.connect("mongodb://localhost:27017/food_test");
    console.log("Connected to MongoDB");

    // 2. Create sample documents
    const nutrient = await NutrientModel.create({
      name: "Protein",
      unit: "g",
      totalAmount: 50,
      amount100g: 25
    });

    const recipe = await RecipeModel.create({
      name: "Grilled Chicken Salad",
      ingredients: [
        {
          scannedItem: {
            name: "Chicken breast",
            calories: 300,
            macros: { protein: 50, fat: 5 }
          },
          percentage: 100
        }
      ]
    });

    const dailyIntake = await DailyIntakeModel.create({
      totalCalories: 2000,
      totalMacros: [
        { name: "protein", unit: "g", totalAmount: 50, amount100g: 25 },
        { name: "fat", unit: "g", totalAmount: 5, amount100g: 2.5 },
        { name: "carbs", unit: "g", totalAmount: 4, amount100g: 2 }
      ],
      foodItems: recipe.ingredients,
      date: new Date()
    });

    const diet = await DietModel.create({
      name: "Keto",
      caloriesAmount: 2000
    });

    await diet.save();

    // console.log("Created Nutrient:", nutrient);
    // console.log("Created Recipe:", recipe);
    // console.log("Created DailyIntake:", dailyIntake);
    // console.log("Created Diet:", diet);

    // 3. Query and verify
    const found = await RecipeModel.findOne({ name: "Grilled Chicken Salad" });
    console.log("\n\nFound recipe:", found);

    // Find all nutrients
    const allNutrients = await NutrientModel.find();
    console.log("\nAll nutrients:", allNutrients);

    // Find daily intakes with more than 1500 calories
    const highCalIntakes = await DailyIntakeModel.find({ totalCalories: { $gt: 1500 } });
    console.log("\nHigh calorie daily intakes:", highCalIntakes);

    // Find diets with exactly 2000 calories
    const specificDiet = await DietModel.findOne({ caloriesAmount: 2000 });
    console.log("\nDiet with 2000 calories:", specificDiet);

    // Count recipes
    const recipeCount = await RecipeModel.countDocuments();
    console.log("\nTotal recipes:", recipeCount);

    // Find a nutrient by name
    const proteinNutrient = await NutrientModel.findOne({ name: "Protein" });
    console.log("\nProtein nutrient:", proteinNutrient);

    // Find daily intakes by date (today)
    const todayIntakes = await DailyIntakeModel.find({
      date: {
        $gte: new Date(new Date().setHours(0, 0, 0, 0)),
        $lte: new Date(new Date().setHours(23, 59, 59, 999))
      }
    });
    console.log("\nDaily intakes today:", todayIntakes);

  } catch (err) {
    console.error("Error during test:", err);
  } finally {
    await mongoose.disconnect();
    console.log("Disconnected from MongoDB");
  }
}

runTests();
