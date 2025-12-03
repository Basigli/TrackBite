import mongoose from "mongoose";
import { RecipeModel } from "./storage/RecipeSchema";
import { DietModel } from "./storage/DietSchema";
import { UserModel } from "./storage/UserSchema";
import UserCredentialsModel from "./storage/UserCredentialsSchema";
import { DailyIntakeModel } from "./storage/DailyIntakeSchema";
import { ScannedItemModel } from "./storage/ScannedItemSchema";
import { NutrientModel } from "./storage/NutrientSchema";
import { FoodItemModel } from "./storage/FoodItemSchema";

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

  // Nutrients
  const protein = await NutrientModel.create({ name: "Protein", unit: "g", totalAmount: 25, amount100g: 25 });
  const fat = await NutrientModel.create({ name: "Fat", unit: "g", totalAmount: 10, amount100g: 10 });
  console.log("Inserted nutrients:", protein._id, fat._id);

  // Scanned items (products)
  const apple = await ScannedItemModel.create({
    name: "Apple",
    allergens: [],
    nutrients: [],
    ingredients: ["Apple"],
    score: 8,
    grade: "A",
    nutrientLevels: {}
  });

  const tomato = await ScannedItemModel.create({
    name: "Tomato",
    allergens: [],
    nutrients: [],
    ingredients: ["Tomato"],
    score: 9,
    grade: "A",
    nutrientLevels: {}
  });
  console.log("Inserted scanned items:", apple._id, tomato._id);

  // Food items (can be stored standalone or embedded depending on usage)
  const foodItemApple = await FoodItemModel.create({
    scannedItem: apple.toObject(),
    percentage: 100,
  });

  const foodItemTomato = await FoodItemModel.create({
    scannedItem: tomato.toObject(),
    percentage: 100,
  });
  console.log("Inserted food items:", foodItemApple._id, foodItemTomato._id);

  // Users
  const userA = await UserModel.create({ nickname: "alice", mail: "alice@example.com", savedRecipesIds: [] });
  const userB = await UserModel.create({ nickname: "bob", mail: "bob@example.com", savedRecipesIds: [] });
  console.log("Inserted users:", userA._id, userB._id);

  // UserCredentials
  const passwordA = "passwordAlice";
  const passwordB = "passwordBob";
  const userCredentialsA = await UserCredentialsModel.create({ nickname: userA.nickname, passwordHash: passwordA });
  const userCredentialsB = await UserCredentialsModel.create({ nickname: userB.nickname, passwordHash: passwordB });
  console.log("Inserted user credentials for users");

  // Recipes
  const recipe = await RecipeModel.create({
    name: "Tomato Salad",
    ingredients: [
      {
        _id: new mongoose.Types.ObjectId().toString(),
        scannedItem: tomato.toObject(),
        percentage: 100
      }
    ],
    userId: userA._id.toString()
  });
  console.log("Inserted recipe:", recipe._id);

  // Daily Intakes
  const today = new Date().toISOString();
  const daily = await DailyIntakeModel.create({
    totalCalories: 500,
    totalMacros: [],
    foodItems: [
      {
        _id: new mongoose.Types.ObjectId().toString(),
        scannedItem: apple.toObject(),
        percentage: 100
      }
    ],
    date: today,
    userId: userA._id.toString()
  });
  console.log("Inserted daily intake:", daily._id);

  // Diets
  const diet = await DietModel.create({ name: "Low Carb", caloriesAmount: 1500, userId: userA._id.toString() });
  console.log("Inserted diet:", diet._id);
  const diet2 = await DietModel.create({ name: "High Protein", caloriesAmount: 2000, userId: userA._id.toString() });
  console.log("Inserted diet:", diet2._id);

  console.log("Seeding done.");
  await mongoose.disconnect();
  console.log("Disconnected");
}

seed().catch(err => {
  console.error("Seed error:", err);
  process.exit(1);
});