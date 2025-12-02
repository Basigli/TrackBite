import mongoose from "mongoose";
import { RecipeModel } from "../src/storage/RecipeSchema";
import { DietModel } from "../src/storage/DietSchema";
import { UserModel } from "../src/storage/UserSchema";
import UserCredentialsModel from "../src/storage/UserCredentialsSchema";
import { DailyIntakeModel } from "../src/storage/DailyIntakeSchema";
import { ScannedItemModel } from "../src/storage/ScannedItemSchema";
import { NutrientModel } from "../src/storage/NutrientSchema";
import { FoodItemModel } from "../src/storage/FoodItemSchema";

const MONGO_URI = process.env.MONGO_URI || "mongodb://localhost:27017/trackbite";

async function seed() {
  await mongoose.connect(MONGO_URI);
  console.log("Connected to", MONGO_URI);

  // Clean collections
  await Promise.all([
    RecipeModel.deleteMany({}),
    DietModel.deleteMany({}),
    UserModel.deleteMany({}),
    DailyIntakeModel.deleteMany({}),
    ScannedItemModel.deleteMany({}),
    NutrientModel.deleteMany({}),
    FoodItemModel.deleteMany({}),
    UserCredentialsModel.deleteMany({}),
  ]);
  console.log("Cleared collections");

  // ===== NUTRIENTS =====
  const proteinNutrient = await NutrientModel.create({
    name: "Protein",
    unit: "g",
    totalAmount: 26.5,
    amount100g: 26.5,
    amountPerServing: 27
  });

  const fatNutrient = await NutrientModel.create({
    name: "Fat",
    unit: "g",
    totalAmount: 12.3,
    amount100g: 12.3,
    amountPerServing: 13
  });

  const carbsNutrient = await NutrientModel.create({
    name: "Carbohydrates",
    unit: "g",
    totalAmount: 45.8,
    amount100g: 45.8,
    amountPerServing: 46
  });

  const fiberNutrient = await NutrientModel.create({
    name: "Fiber",
    unit: "g",
    totalAmount: 8.2,
    amount100g: 8.2,
    amountPerServing: 8.5
  });

  const sodiumNutrient = await NutrientModel.create({
    name: "Sodium",
    unit: "mg",
    totalAmount: 340,
    amount100g: 340,
    amountPerServing: 350
  });

  const sugarNutrient = await NutrientModel.create({
    name: "Sugar",
    unit: "g",
    totalAmount: 15.6,
    amount100g: 15.6,
    amountPerServing: 16
  });

  console.log("Inserted nutrients");

  // ===== SCANNED ITEMS (Products) =====
  const chickenBreast = await ScannedItemModel.create({
    _id: "0000000000001",
    name: "Chicken Breast",
    quantity: 100,
    quantityPerServing: 100,
    quantityUnit: "g",
    allergens: [],
    nutrients: [
      { ...proteinNutrient.toObject(), totalAmount: 31, amount100g: 31, amountPerServing: 30 },
      { ...fatNutrient.toObject(), totalAmount: 3.6, amount100g: 3.6, amountPerServing: 3 },
      { ...carbsNutrient.toObject(), totalAmount: 0, amount100g: 0, amountPerServing: 0 }
    ],
    ingredients: ["Chicken breast", "Water", "Salt"],
    score: 9,
    grade: "A",
    nutrientLevels: {
      "protein": "high",
      "fat": "low",
      "carbohydrates": "low",
      "sodium": "moderate"
    }
  });

  const brownRice = await ScannedItemModel.create({
    _id: "0000000000002",
    name: "Brown Rice",
    quantity: 100,
    quantityPerServing: 100,
    quantityUnit: "g",
    allergens: [],
    nutrients: [
      { ...proteinNutrient.toObject(), totalAmount: 7.5, amount100g: 7.5, amountPerServing: 8 },
      { ...fatNutrient.toObject(), totalAmount: 2.8, amount100g: 2.8, amountPerServing: 3 },
      { ...carbsNutrient.toObject(), totalAmount: 77.2, amount100g: 77.2, amountPerServing: 80 },
      { ...fiberNutrient.toObject(), totalAmount: 3.5, amount100g: 3.5, amountPerServing: 4 }
    ],
    ingredients: ["Whole grain brown rice"],
    score: 8,
    grade: "A",
    nutrientLevels: {
      "protein": "moderate",
      "fat": "low",
      "carbohydrates": "high",
      "fiber": "high"
    }
  });

  const almondMilk = await ScannedItemModel.create({
    _id: "0000000000003",
    name: "Almond Milk Unsweetened",
    quantity: 100,
    quantityPerServing: 100,
    quantityUnit: "g",
    allergens: ["nuts", "tree nuts"],
    nutrients: [
      { ...proteinNutrient.toObject(), totalAmount: 1.0, amount100g: 1.0, amountPerServing: 1 },
      { ...fatNutrient.toObject(), totalAmount: 2.5, amount100g: 2.5, amountPerServing: 3 },
      { ...carbsNutrient.toObject(), totalAmount: 1.4, amount100g: 1.4, amountPerServing: 2 },
      { ...sodiumNutrient.toObject(), totalAmount: 170, amount100g: 170, amountPerServing: 180 }
    ],
    ingredients: ["Filtered water", "Almonds", "Calcium carbonate", "Sea salt", "Vitamin E"],
    score: 7,
    grade: "B",
    nutrientLevels: {
      "protein": "low",
      "fat": "low",
      "carbohydrates": "low",
      "sodium": "moderate"
    }
  });

  const spinach = await ScannedItemModel.create({
    _id: "0000000000004",
    name: "Fresh Spinach",
    quantity: 100,
    quantityPerServing: 100,
    quantityUnit: "g",
    allergens: [],
    nutrients: [
      { ...proteinNutrient.toObject(), totalAmount: 2.9, amount100g: 2.9, amountPerServing: 3 },
      { ...fatNutrient.toObject(), totalAmount: 0.4, amount100g: 0.4, amountPerServing: 0.5 },
      { ...carbsNutrient.toObject(), totalAmount: 3.6, amount100g: 3.6, amountPerServing: 4 },
      { ...fiberNutrient.toObject(), totalAmount: 2.2, amount100g: 2.2, amountPerServing: 2.5 }
    ],
    ingredients: ["Spinach"],
    score: 10,
    grade: "A",
    nutrientLevels: {
      "protein": "low",
      "fat": "low",
      "carbohydrates": "low",
      "fiber": "moderate"
    }
  });

  const salmonFillet = await ScannedItemModel.create({
    _id: "0000000000005",
    name: "Atlantic Salmon Fillet",
    quantity: 100,
    quantityPerServing: 100,
    quantityUnit: "g",
    allergens: ["fish"],
    nutrients: [
      { ...proteinNutrient.toObject(), totalAmount: 25.4, amount100g: 25.4, amountPerServing: 26 },
      { ...fatNutrient.toObject(), totalAmount: 13.4, amount100g: 13.4, amountPerServing: 14 },
      { ...carbsNutrient.toObject(), totalAmount: 0, amount100g: 0, amountPerServing: 0 }
    ],
    ingredients: ["Atlantic salmon", "Water retained during processing"],
    score: 9,
    grade: "A",
    nutrientLevels: {
      "protein": "high",
      "fat": "moderate",
      "carbohydrates": "low",
      "omega-3": "high"
    }
  });

  const wholeWheatBread = await ScannedItemModel.create({
    _id: "0000000000006",
    name: "Whole Wheat Bread",
    quantity: 100,
    quantityPerServing: 100,
    quantityUnit: "g",
    allergens: ["wheat", "gluten", "soy"],
    nutrients: [
      { ...proteinNutrient.toObject(), totalAmount: 9.2, amount100g: 9.2, amountPerServing: 10 },
      { ...fatNutrient.toObject(), totalAmount: 3.4, amount100g: 3.4, amountPerServing: 4 },
      { ...carbsNutrient.toObject(), totalAmount: 43.3, amount100g: 43.3, amountPerServing: 45 },
      { ...fiberNutrient.toObject(), totalAmount: 6.0, amount100g: 6.0, amountPerServing: 6.5 },
      { ...sugarNutrient.toObject(), totalAmount: 4.5, amount100g: 4.5, amountPerServing: 5 },
      { ...sodiumNutrient.toObject(), totalAmount: 491, amount100g: 491, amountPerServing: 500 }
    ],
    ingredients: ["Whole wheat flour", "Water", "Yeast", "Salt", "Soybean oil", "Sugar", "Wheat gluten"],
    score: 7,
    grade: "B",
    nutrientLevels: {
      "protein": "moderate",
      "fat": "low",
      "carbohydrates": "high",
      "fiber": "high",
      "sodium": "moderate",
      "sugar": "low"
    }
  });

  console.log("Inserted scanned items");

  // ===== FOOD ITEMS =====
  const foodItemChicken = await FoodItemModel.create({
    scannedItem: chickenBreast.toObject(),
    percentage: 100
  });

  const foodItemRice = await FoodItemModel.create({
    scannedItem: brownRice.toObject(),
    percentage: 75
  });

  const foodItemSpinach = await FoodItemModel.create({
    scannedItem: spinach.toObject(),
    percentage: 100
  });

  const foodItemSalmon = await FoodItemModel.create({
    scannedItem: salmonFillet.toObject(),
    percentage: 100
  });

  console.log("Inserted food items");

  // ===== USERS =====
  const userAlice = await UserModel.create({
    nickname: "alice",
    mail: "alice@example.com",
    savedRecipesIds: []
  });

  const userBob = await UserModel.create({
    nickname: "bob",
    mail: "bob@example.com",
    savedRecipesIds: []
  });

  const userCharlie = await UserModel.create({
    nickname: "charlie",
    mail: "charlie@fitlife.com",
    savedRecipesIds: []
  });

  console.log("Inserted users:", userAlice._id, userBob._id, userCharlie._id);

  // ===== USER CREDENTIALS =====
  await UserCredentialsModel.create({
    nickname: userAlice.nickname,
    passwordHash: "passwordAlice"
  });

  await UserCredentialsModel.create({
    nickname: userBob.nickname,
    passwordHash: "passwordBob"
  });

  await UserCredentialsModel.create({
    nickname: userCharlie.nickname,
    passwordHash: "passwordCharlie"
  });

  console.log("Inserted user credentials");

  // ===== RECIPES =====
  const recipeGrilledChicken = await RecipeModel.create({
    name: "Grilled Chicken with Brown Rice and Spinach",
    ingredients: [
      {
        _id: new mongoose.Types.ObjectId().toString(),
        scannedItem: chickenBreast.toObject(),
        percentage: 100
      },
      {
        _id: new mongoose.Types.ObjectId().toString(),
        scannedItem: brownRice.toObject(),
        percentage: 75
      },
      {
        _id: new mongoose.Types.ObjectId().toString(),
        scannedItem: spinach.toObject(),
        percentage: 100
      }
    ],
    userId: userAlice._id.toString()
  });

  const recipeSalmonBowl = await RecipeModel.create({
    name: "Salmon Power Bowl",
    ingredients: [
      {
        _id: new mongoose.Types.ObjectId().toString(),
        scannedItem: salmonFillet.toObject(),
        percentage: 100
      },
      {
        _id: new mongoose.Types.ObjectId().toString(),
        scannedItem: brownRice.toObject(),
        percentage: 100
      },
      {
        _id: new mongoose.Types.ObjectId().toString(),
        scannedItem: spinach.toObject(),
        percentage: 50
      }
    ],
    userId: userBob._id.toString()
  });

  const recipeBreakfastToast = await RecipeModel.create({
    name: "Protein Breakfast Toast",
    ingredients: [
      {
        _id: new mongoose.Types.ObjectId().toString(),
        scannedItem: wholeWheatBread.toObject(),
        percentage: 100
      },
      {
        _id: new mongoose.Types.ObjectId().toString(),
        scannedItem: almondMilk.toObject(),
        percentage: 100
      }
    ],
    userId: userCharlie._id.toString()
  });

  console.log("Inserted recipes");

  // Update user with saved recipes
  userAlice.savedRecipesIds = [recipeGrilledChicken._id.toString(), recipeSalmonBowl._id.toString()];
  await userAlice.save();

  userBob.savedRecipesIds = [recipeSalmonBowl._id.toString()];
  await userBob.save();

  // ===== DAILY INTAKES =====
  const today = new Date();
  const yesterday = new Date(Date.now() - 86400000);
  const twoDaysAgo = new Date(Date.now() - 2 * 86400000);
  const threeDaysAgo = new Date(Date.now() - 3 * 86400000);

  const dailyIntakeToday = await DailyIntakeModel.create({
    totalCalories: 1850,
    totalMacros: [
      { ...proteinNutrient.toObject(), totalAmount: 145, amount100g: 26.5, amountPerServing: 27 },
      { ...fatNutrient.toObject(), totalAmount: 62, amount100g: 12.3, amountPerServing: 13 },
      { ...carbsNutrient.toObject(), totalAmount: 180, amount100g: 45.8, amountPerServing: 46 }
    ],
    foodItems: [
      {
        _id: new mongoose.Types.ObjectId().toString(),
        scannedItem: chickenBreast.toObject(),
        percentage: 100
      },
      {
        _id: new mongoose.Types.ObjectId().toString(),
        scannedItem: brownRice.toObject(),
        percentage: 100
      },
      {
        _id: new mongoose.Types.ObjectId().toString(),
        scannedItem: spinach.toObject(),
        percentage: 100
      },
      {
        _id: new mongoose.Types.ObjectId().toString(),
        scannedItem: salmonFillet.toObject(),
        percentage: 100
      }
    ],
    date: today.toISOString(),
    userId: userAlice._id.toString()
  });

  const dailyIntakeYesterday = await DailyIntakeModel.create({
    totalCalories: 2100,
    totalMacros: [
      { ...proteinNutrient.toObject(), totalAmount: 160, amount100g: 26.5, amountPerServing: 27 },
      { ...fatNutrient.toObject(), totalAmount: 70, amount100g: 12.3, amountPerServing: 13 },
      { ...carbsNutrient.toObject(), totalAmount: 210, amount100g: 45.8, amountPerServing: 46 }
    ],
    foodItems: [
      {
        _id: new mongoose.Types.ObjectId().toString(),
        scannedItem: salmonFillet.toObject(),
        percentage: 100
      },
      {
        _id: new mongoose.Types.ObjectId().toString(),
        scannedItem: brownRice.toObject(),
        percentage: 100
      },
      {
        _id: new mongoose.Types.ObjectId().toString(),
        scannedItem: wholeWheatBread.toObject(),
        percentage: 100
      },
      {
        _id: new mongoose.Types.ObjectId().toString(),
        scannedItem: almondMilk.toObject(),
        percentage: 100
      }
    ],
    date: yesterday.toISOString(),
    userId: userAlice._id.toString()
  });

  const dailyIntakeTwoDaysAgo = await DailyIntakeModel.create({
    totalCalories: 1650,
    totalMacros: [
      { ...proteinNutrient.toObject(), totalAmount: 120, amount100g: 26.5, amountPerServing: 27 },
      { ...fatNutrient.toObject(), totalAmount: 55, amount100g: 12.3, amountPerServing: 13 },
      { ...carbsNutrient.toObject(), totalAmount: 165, amount100g: 45.8, amountPerServing: 46 }
    ],
    foodItems: [
      {
        _id: new mongoose.Types.ObjectId().toString(),
        scannedItem: chickenBreast.toObject(),
        percentage: 100
      },
      {
        _id: new mongoose.Types.ObjectId().toString(),
        scannedItem: spinach.toObject(),
        percentage: 100
      }
    ],
    date: twoDaysAgo.toISOString(),
    userId: userBob._id.toString()
  });

  const dailyIntakeThreeDaysAgo = await DailyIntakeModel.create({
    totalCalories: 1950,
    totalMacros: [
      { ...proteinNutrient.toObject(), totalAmount: 135, amount100g: 26.5, amountPerServing: 27 },
      { ...fatNutrient.toObject(), totalAmount: 68, amount100g: 12.3, amountPerServing: 13 },
      { ...carbsNutrient.toObject(), totalAmount: 195, amount100g: 45.8, amountPerServing: 46 }
    ],
    foodItems: [
      {
        _id: new mongoose.Types.ObjectId().toString(),
        scannedItem: salmonFillet.toObject(),
        percentage: 100
      },
      {
        _id: new mongoose.Types.ObjectId().toString(),
        scannedItem: brownRice.toObject(),
        percentage: 100
      },
      {
        _id: new mongoose.Types.ObjectId().toString(),
        scannedItem: spinach.toObject(),
        percentage: 100
      }
    ],
    date: threeDaysAgo.toISOString(),
    userId: userCharlie._id.toString()
  });

  console.log("Inserted daily intakes");

  // ===== DIETS =====
  const dietLowCarb = await DietModel.create({
    name: "Low Carb Weight Loss",
    caloriesAmount: 1600,
    userId: userAlice._id.toString()
  });

  const dietHighProtein = await DietModel.create({
    name: "High Protein Muscle Building",
    caloriesAmount: 2400,
    userId: userAlice._id.toString()
  });

  const dietBalanced = await DietModel.create({
    name: "Balanced Mediterranean",
    caloriesAmount: 2000,
    userId: userBob._id.toString()
  });

  const dietVegan = await DietModel.create({
    name: "Plant-Based Vegan",
    caloriesAmount: 1800,
    userId: userCharlie._id.toString()
  });

  const dietKeto = await DietModel.create({
    name: "Ketogenic Diet",
    caloriesAmount: 1500,
    userId: userCharlie._id.toString()
  });

  console.log("Inserted diets");

  console.log("\n=================================");
  console.log("SEEDING COMPLETED SUCCESSFULLY");
  console.log("=================================");
  console.log(`Users created: ${[userAlice, userBob, userCharlie].length}`);
  console.log(`Scanned items: ${[chickenBreast, brownRice, almondMilk, spinach, salmonFillet, wholeWheatBread].length}`);
  console.log(`Recipes: ${[recipeGrilledChicken, recipeSalmonBowl, recipeBreakfastToast].length}`);
  console.log(`Daily intakes: ${[dailyIntakeToday, dailyIntakeYesterday, dailyIntakeTwoDaysAgo, dailyIntakeThreeDaysAgo].length}`);
  console.log(`Diets: ${[dietLowCarb, dietHighProtein, dietBalanced, dietVegan, dietKeto].length}`);
  console.log("=================================\n");

  await mongoose.disconnect();
  console.log("Disconnected from MongoDB");
}

seed().catch(err => {
  console.error("Seed error:", err);
  process.exit(1);
});