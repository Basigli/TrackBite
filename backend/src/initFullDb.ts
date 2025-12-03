import mongoose from "mongoose";
import { RecipeModel } from "./storage/RecipeSchema";
import { DietModel } from "./storage/DietSchema";
import { UserModel } from "./storage/UserSchema";
import UserCredentialsModel from "./storage/UserCredentialsSchema";
import { DailyIntakeModel } from "./storage/DailyIntakeSchema";
import { ScannedItemModel } from "./storage/ScannedItemSchema";
import { NutrientModel } from "./storage/NutrientSchema";
import { FoodItemModel } from "./storage/FoodItemSchema";
import { FoodItemConverter } from "./utils/FoodItemConverter";

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

  const energyNutrient = await NutrientModel.create({
    name: "energy",
    unit: "kcal",
    totalAmount: 250,
    amount100g: 250,
    amountPerServing: 255
  });

  console.log("Inserted nutrients");

  // ===== SCANNED ITEMS (Products) =====
  const chickenBreast = await ScannedItemModel.create({
    barcode: "0000000000001",
    name: "Chicken Breast",
    quantity: 100,
    quantityPerServing: 100,
    quantityUnit: "g",
    allergens: [],
    nutrients: [
      { ...energyNutrient.toObject(), totalAmount: 165, amount100g: 165, amountPerServing: 160 },
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
    barcode: "0000000000002",
    name: "Brown Rice",
    quantity: 100,
    quantityPerServing: 100,
    quantityUnit: "g",
    allergens: [],
    nutrients: [
      { ...energyNutrient.toObject(), totalAmount: 370, amount100g: 370, amountPerServing: 400 },
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
    barcode: "0000000000003",
    name: "Almond Milk Unsweetened",
    quantity: 100,
    quantityPerServing: 100,
    quantityUnit: "g",
    allergens: ["nuts", "tree nuts"],
    nutrients: [
      { ...energyNutrient.toObject(), totalAmount: 15, amount100g: 15, amountPerServing: 20 },
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
    barcode: "0000000000004",
    name: "Fresh Spinach",
    quantity: 500,
    quantityPerServing: 100,
    quantityUnit: "g",
    allergens: [],
    nutrients: [
      { ...energyNutrient.toObject(), totalAmount: 23, amount100g: 23, amountPerServing: 25 },
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
    barcode: "0000000000005",
    name: "Atlantic Salmon Fillet",
    quantity: 1000,
    quantityPerServing: 100,
    quantityUnit: "g",
    allergens: ["fish"],
    nutrients: [
      { ...energyNutrient.toObject(), totalAmount: 208, amount100g: 208, amountPerServing: 210 },
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
    barcode: "0000000000006",
    name: "Whole Wheat Bread",
    quantity: 100,
    quantityPerServing: 100,
    quantityUnit: "g",
    allergens: ["wheat", "gluten", "soy"],
    nutrients: [
      { ...energyNutrient.toObject(), totalAmount: 247, amount100g: 247, amountPerServing: 250 },
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
  const converter = new FoodItemConverter();

  const foodItemChicken = await FoodItemModel.create(converter.toFoodItemWithGrams(chickenBreast, 100));
  const foodItemRice = await FoodItemModel.create(converter.toFoodItemWithGrams(brownRice, 75));
  const foodItemSpinach = await FoodItemModel.create(converter.toFoodItemWithServings(spinach, 1));
  const foodItemSalmon = await FoodItemModel.create(converter.toFoodItemWithServings(salmonFillet, 2));
  const foodItemWholeWheatBread = await FoodItemModel.create(converter.toFoodItemWithGrams(wholeWheatBread, 50));
  const foodItemAlmondMilk = await FoodItemModel.create(converter.toFoodItemWithGrams(almondMilk, 200));


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
      foodItemChicken,
      foodItemRice,
      foodItemSpinach
    ],
    userId: userAlice._id.toString()
  });

  const recipeSalmonBowl = await RecipeModel.create({
    name: "Salmon Power Bowl",
    ingredients: [
      foodItemSalmon,
      foodItemRice,
      foodItemSpinach
    ],
    userId: userBob._id.toString()
  });

  const recipeBreakfastToast = await RecipeModel.create({
    name: "Protein Breakfast Toast",
    ingredients: [
      foodItemWholeWheatBread,
      foodItemAlmondMilk
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
    { name: "Protein", unit: "g", totalAmount: 145, amount100g: 26.5, amountPerServing: 27 },
    { name: "Fat", unit: "g", totalAmount: 62, amount100g: 12.3, amountPerServing: 13 },
    { name: "Carbohydrates", unit: "g", totalAmount: 180, amount100g: 45.8, amountPerServing: 46 }
  ],
  foodItems: [
    converter.toFoodItemWithGrams(chickenBreast, 100),
    converter.toFoodItemWithGrams(brownRice, 100),
    converter.toFoodItemWithServings(spinach, 1),
    converter.toFoodItemWithServings(salmonFillet, 1)
  ],
  date: today.toISOString(),
  userId: userAlice._id.toString()
});

const dailyIntakeYesterday = await DailyIntakeModel.create({
  totalCalories: 2100,
  totalMacros: [
    { name: "Protein", unit: "g", totalAmount: 160, amount100g: 26.5, amountPerServing: 27 },
    { name: "Fat", unit: "g", totalAmount: 70, amount100g: 12.3, amountPerServing: 13 },
    { name: "Carbohydrates", unit: "g", totalAmount: 210, amount100g: 45.8, amountPerServing: 46 }
  ],
  foodItems: [
    converter.toFoodItemWithServings(salmonFillet, 1),
    converter.toFoodItemWithGrams(brownRice, 100),
    converter.toFoodItemWithGrams(wholeWheatBread, 100),
    converter.toFoodItemWithGrams(almondMilk, 100)
  ],
  date: yesterday.toISOString(),
  userId: userAlice._id.toString()
});

const dailyIntakeTwoDaysAgo = await DailyIntakeModel.create({
  totalCalories: 1650,
  totalMacros: [
    { name: "Protein", unit: "g", totalAmount: 120, amount100g: 26.5, amountPerServing: 27 },
    { name: "Fat", unit: "g", totalAmount: 55, amount100g: 12.3, amountPerServing: 13 },
    { name: "Carbohydrates", unit: "g", totalAmount: 165, amount100g: 45.8, amountPerServing: 46 }
  ],
  foodItems: [
    converter.toFoodItemWithGrams(chickenBreast, 100),
    converter.toFoodItemWithServings(spinach, 2)
  ],
  date: twoDaysAgo.toISOString(),
  userId: userBob._id.toString()
});

const dailyIntakeThreeDaysAgo = await DailyIntakeModel.create({
  totalCalories: 1950,
  totalMacros: [
    { name: "Protein", unit: "g", totalAmount: 135, amount100g: 26.5, amountPerServing: 27 },
    { name: "Fat", unit: "g", totalAmount: 68, amount100g: 12.3, amountPerServing: 13 },
    { name: "Carbohydrates", unit: "g", totalAmount: 195, amount100g: 45.8, amountPerServing: 46 }
  ],
  foodItems: [
    converter.toFoodItemWithServings(salmonFillet, 1),
    converter.toFoodItemWithGrams(brownRice, 100),
    converter.toFoodItemWithServings(spinach, 1)
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