import request from "supertest";
import {
  beforeAll,
  afterAll,
  beforeEach,
  describe,
  it,
  expect,
} from "@jest/globals";

import mongoose from "mongoose";
import { MongoMemoryServer } from "mongodb-memory-server";
import { app } from "../../src/app";
import { RecipeModel } from "../../src/storage/RecipeSchema";
import { UserModel } from "../../src/storage/UserSchema";

let mongoServer: MongoMemoryServer;

let userId1 = new mongoose.Types.ObjectId().toString();
let userId2 = new mongoose.Types.ObjectId().toString();
const nonExistentUserId = new mongoose.Types.ObjectId().toString();

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  const uri = mongoServer.getUri();
  await mongoose.connect(uri);
});

afterAll(async () => {
  await mongoose.connection.dropDatabase();
  await mongoose.connection.close();
  await mongoServer.stop();
});

beforeEach(async () => {
  await RecipeModel.deleteMany({});
  await UserModel.deleteMany({});

  await UserModel.create({
    _id: userId1,
    nickname: "Test User 1",
    mail: "user1@example.com",
    savedRecipesIds: [],
    savedScannedItemsIds: [],
    isAdmin: false
  });

  await UserModel.create({
    _id: userId2,
    nickname: "Test User 2",
    mail: "user2@example.com",
    savedRecipesIds: [],
    savedScannedItemsIds: [],
    isAdmin: false
  });
});

describe("Recipe Routes", () => {
  const tomatoFoodItem = {
    _id: new mongoose.Types.ObjectId().toString(),
    name: "Fresh Tomato",
    quantity: "200g",
    calories: 36,
    allergens: [],
    ingredients: ["tomato"],
    nutrients: [
      { _id: new mongoose.Types.ObjectId().toString(), name: "vitamin-a", unit: "% DV", totalAmount: 20, amount100g: 10, amountPerServing: 20 },
      { _id: new mongoose.Types.ObjectId().toString(), name: "vitamin-c", unit: "% DV", totalAmount: 28, amount100g: 14, amountPerServing: 28 },
      { _id: new mongoose.Types.ObjectId().toString(), name: "vitamin-k", unit: "% DV", totalAmount: 10, amount100g: 5, amountPerServing: 10 },
      { _id: new mongoose.Types.ObjectId().toString(), name: "potassium", unit: "mg", totalAmount: 292, amount100g: 146, amountPerServing: 292 },
      { _id: new mongoose.Types.ObjectId().toString(), name: "fiber", unit: "g", totalAmount: 2.2, amount100g: 1.1, amountPerServing: 2.2 },
      { _id: new mongoose.Types.ObjectId().toString(), name: "folate", unit: "% DV", totalAmount: 8, amount100g: 4, amountPerServing: 8 }
    ],
    macros: [
      { _id: new mongoose.Types.ObjectId().toString(), name: "protein", unit: "g", totalAmount: 1.8, amount100g: 0.9, amountPerServing: 1.8 },
      { _id: new mongoose.Types.ObjectId().toString(), name: "carbohydrates", unit: "g", totalAmount: 7.8, amount100g: 3.9, amountPerServing: 7.8 },
      { _id: new mongoose.Types.ObjectId().toString(), name: "fat", unit: "g", totalAmount: 0.4, amount100g: 0.2, amountPerServing: 0.4 },
      { _id: new mongoose.Types.ObjectId().toString(), name: "sugar", unit: "g", totalAmount: 5.3, amount100g: 2.65, amountPerServing: 5.3 }
    ],
    score: 92,
    grade: "A",
    nutrientLevels: {
      "sodium": "low",
      "sugar": "moderate",
      "saturated-fat": "low"
    }
  };

  const cheeseFoodItem = {
    _id: new mongoose.Types.ObjectId().toString(),
    name: "Mozzarella Cheese",
    quantity: "100g",
    calories: 280,
    allergens: ["milk", "dairy"],
    ingredients: ["pasteurized milk", "salt", "enzymes", "cultures"],
    nutrients: [
      { _id: new mongoose.Types.ObjectId().toString(), name: "calcium", unit: "% DV", totalAmount: 50, amount100g: 50, amountPerServing: 50 },
      { _id: new mongoose.Types.ObjectId().toString(), name: "vitamin-a", unit: "% DV", totalAmount: 10, amount100g: 10, amountPerServing: 10 },
      { _id: new mongoose.Types.ObjectId().toString(), name: "vitamin-b12", unit: "% DV", totalAmount: 15, amount100g: 15, amountPerServing: 15 },
      { _id: new mongoose.Types.ObjectId().toString(), name: "phosphorus", unit: "% DV", totalAmount: 35, amount100g: 35, amountPerServing: 35 },
      { _id: new mongoose.Types.ObjectId().toString(), name: "zinc", unit: "% DV", totalAmount: 18, amount100g: 18, amountPerServing: 18 },
      { _id: new mongoose.Types.ObjectId().toString(), name: "selenium", unit: "% DV", totalAmount: 25, amount100g: 25, amountPerServing: 25 }
    ],
    macros: [
      { _id: new mongoose.Types.ObjectId().toString(), name: "protein", unit: "g", totalAmount: 22, amount100g: 22, amountPerServing: 22 },
      { _id: new mongoose.Types.ObjectId().toString(), name: "carbohydrates", unit: "g", totalAmount: 3.1, amount100g: 3.1, amountPerServing: 3.1 },
      { _id: new mongoose.Types.ObjectId().toString(), name: "fat", unit: "g", totalAmount: 21, amount100g: 21, amountPerServing: 21 },
      { _id: new mongoose.Types.ObjectId().toString(), name: "saturated-fat", unit: "g", totalAmount: 13, amount100g: 13, amountPerServing: 13 }
    ],
    score: 68,
    grade: "B",
    nutrientLevels: {
      "sodium": "moderate",
      "saturated-fat": "high",
      "cholesterol": "moderate"
    }
  };

  const basilFoodItem = {
    _id: new mongoose.Types.ObjectId().toString(),
    name: "Fresh Basil",
    quantity: "10g",
    calories: 2,
    allergens: [],
    ingredients: ["basil"],
    nutrients: [
      { _id: new mongoose.Types.ObjectId().toString(), name: "vitamin-k", unit: "% DV", totalAmount: 43, amount100g: 430, amountPerServing: 43 },
      { _id: new mongoose.Types.ObjectId().toString(), name: "vitamin-a", unit: "% DV", totalAmount: 6, amount100g: 60, amountPerServing: 6 },
      { _id: new mongoose.Types.ObjectId().toString(), name: "manganese", unit: "% DV", totalAmount: 8, amount100g: 80, amountPerServing: 8 },
      { _id: new mongoose.Types.ObjectId().toString(), name: "iron", unit: "% DV", totalAmount: 3, amount100g: 30, amountPerServing: 3 },
      { _id: new mongoose.Types.ObjectId().toString(), name: "calcium", unit: "% DV", totalAmount: 2, amount100g: 20, amountPerServing: 2 }
    ],
    macros: [
      { _id: new mongoose.Types.ObjectId().toString(), name: "protein", unit: "g", totalAmount: 0.3, amount100g: 3, amountPerServing: 0.3 },
      { _id: new mongoose.Types.ObjectId().toString(), name: "carbohydrates", unit: "g", totalAmount: 0.3, amount100g: 3, amountPerServing: 0.3 },
      { _id: new mongoose.Types.ObjectId().toString(), name: "fat", unit: "g", totalAmount: 0.1, amount100g: 1, amountPerServing: 0.1 },
      { _id: new mongoose.Types.ObjectId().toString(), name: "fiber", unit: "g", totalAmount: 0.2, amount100g: 2, amountPerServing: 0.2 }
    ],
    score: 95,
    grade: "A",
    nutrientLevels: {
      "sodium": "low",
      "saturated-fat": "low",
      "sugar": "low"
    }
  };

  const oliveOilFoodItem = {
    _id: new mongoose.Types.ObjectId().toString(),
    name: "Extra Virgin Olive Oil",
    quantity: "15ml",
    calories: 119,
    allergens: [],
    ingredients: ["extra virgin olive oil"],
    nutrients: [
      { _id: new mongoose.Types.ObjectId().toString(), name: "vitamin-e", unit: "% DV", totalAmount: 13, amount100g: 87, amountPerServing: 13 },
      { _id: new mongoose.Types.ObjectId().toString(), name: "vitamin-k", unit: "% DV", totalAmount: 8, amount100g: 53, amountPerServing: 8 },
      { _id: new mongoose.Types.ObjectId().toString(), name: "iron", unit: "% DV", totalAmount: 2, amount100g: 13, amountPerServing: 2 }
    ],
    macros: [
      { _id: new mongoose.Types.ObjectId().toString(), name: "protein", unit: "g", totalAmount: 0, amount100g: 0, amountPerServing: 0 },
      { _id: new mongoose.Types.ObjectId().toString(), name: "carbohydrates", unit: "g", totalAmount: 0, amount100g: 0, amountPerServing: 0 },
      { _id: new mongoose.Types.ObjectId().toString(), name: "fat", unit: "g", totalAmount: 13.5, amount100g: 90, amountPerServing: 13.5 },
      { _id: new mongoose.Types.ObjectId().toString(), name: "saturated-fat", unit: "g", totalAmount: 1.9, amount100g: 12.7, amountPerServing: 1.9 },
      { _id: new mongoose.Types.ObjectId().toString(), name: "monounsaturated-fat", unit: "g", totalAmount: 9.9, amount100g: 66, amountPerServing: 9.9 }
    ],
    score: 78,
    grade: "B",
    nutrientLevels: {
      "sodium": "low",
      "saturated-fat": "low",
      "monounsaturated-fat": "high"
    }
  };

  const garlicFoodItem = {
    _id: new mongoose.Types.ObjectId().toString(),
    name: "Fresh Garlic",
    quantity: "3 cloves (9g)",
    calories: 13,
    allergens: [],
    ingredients: ["garlic"],
    nutrients: [
      { _id: new mongoose.Types.ObjectId().toString(), name: "vitamin-c", unit: "% DV", totalAmount: 5, amount100g: 56, amountPerServing: 5 },
      { _id: new mongoose.Types.ObjectId().toString(), name: "vitamin-b6", unit: "% DV", totalAmount: 6, amount100g: 67, amountPerServing: 6 },
      { _id: new mongoose.Types.ObjectId().toString(), name: "manganese", unit: "% DV", totalAmount: 8, amount100g: 89, amountPerServing: 8 },
      { _id: new mongoose.Types.ObjectId().toString(), name: "selenium", unit: "% DV", totalAmount: 4, amount100g: 44, amountPerServing: 4 },
      { _id: new mongoose.Types.ObjectId().toString(), name: "calcium", unit: "% DV", totalAmount: 2, amount100g: 22, amountPerServing: 2 }
    ],
    macros: [
      { _id: new mongoose.Types.ObjectId().toString(), name: "protein", unit: "g", totalAmount: 0.6, amount100g: 6.7, amountPerServing: 0.6 },
      { _id: new mongoose.Types.ObjectId().toString(), name: "carbohydrates", unit: "g", totalAmount: 3, amount100g: 33.3, amountPerServing: 3 },
      { _id: new mongoose.Types.ObjectId().toString(), name: "fat", unit: "g", totalAmount: 0.05, amount100g: 0.56, amountPerServing: 0.05 },
      { _id: new mongoose.Types.ObjectId().toString(), name: "fiber", unit: "g", totalAmount: 0.2, amount100g: 2.2, amountPerServing: 0.2 }
    ],
    score: 88,
    grade: "A",
    nutrientLevels: {
      "sodium": "low",
      "saturated-fat": "low",
      "sugar": "low"
    }
  };

  const sampleRecipe = {
    name: "Caprese Salad",
    ingredients: [tomatoFoodItem, cheeseFoodItem, basilFoodItem, oliveOilFoodItem],
    userId: userId1,
    userName: "test-user",
    description: "A classic Italian salad with fresh tomatoes, mozzarella, and basil",
    createdAt: new Date(),
    grade: "A",
    macros: [
      { _id: new mongoose.Types.ObjectId().toString(), name: "protein", unit: "g", totalAmount: 24.7, amount100g: 5.9, amountPerServing: 24.7 },
      { _id: new mongoose.Types.ObjectId().toString(), name: "carbohydrates", unit: "g", totalAmount: 11.5, amount100g: 2.8, amountPerServing: 11.5 },
      { _id: new mongoose.Types.ObjectId().toString(), name: "fat", unit: "g", totalAmount: 35, amount100g: 8.4, amountPerServing: 35 }
    ],
    totalCalories: 437
  };

  const anotherRecipe = {
    name: "Tomato Garlic Pasta Sauce",
    ingredients: [tomatoFoodItem, garlicFoodItem, oliveOilFoodItem, basilFoodItem],
    userId: userId2,
    userName: "another-user",
    description: "A simple and flavorful pasta sauce with fresh tomatoes and garlic",
    createdAt: new Date(),
    grade: "A",
    macros: [
      { _id: new mongoose.Types.ObjectId().toString(), name: "protein", unit: "g", totalAmount: 2.7, amount100g: 1.1, amountPerServing: 2.7 },
      { _id: new mongoose.Types.ObjectId().toString(), name: "carbohydrates", unit: "g", totalAmount: 11.4, amount100g: 4.8, amountPerServing: 11.4 },
      { _id: new mongoose.Types.ObjectId().toString(), name: "fat", unit: "g", totalAmount: 13.65, amount100g: 5.7, amountPerServing: 13.65 }
    ], 
    totalCalories: 200
  };

  const multiIngredientRecipe = {
    name: "Italian Style Pizza",
    ingredients: [
      tomatoFoodItem,
      cheeseFoodItem,
      basilFoodItem,
      oliveOilFoodItem,
      {
        _id: new mongoose.Types.ObjectId().toString(),
        name: "Pizza Dough",
        quantity: "300g",
        calories: 825,
        allergens: ["wheat", "gluten"],
        ingredients: ["flour", "water", "yeast", "salt", "sugar"],
        nutrients: [
          { _id: new mongoose.Types.ObjectId().toString(), name: "iron", unit: "% DV", totalAmount: 25, amount100g: 8.3, amountPerServing: 25 },
          { _id: new mongoose.Types.ObjectId().toString(), name: "thiamin", unit: "% DV", totalAmount: 35, amount100g: 11.7, amountPerServing: 35 },
          { _id: new mongoose.Types.ObjectId().toString(), name: "niacin", unit: "% DV", totalAmount: 30, amount100g: 10, amountPerServing: 30 },
          { _id: new mongoose.Types.ObjectId().toString(), name: "folate", unit: "% DV", totalAmount: 45, amount100g: 15, amountPerServing: 45 },
          { _id: new mongoose.Types.ObjectId().toString(), name: "selenium", unit: "% DV", totalAmount: 40, amount100g: 13.3, amountPerServing: 40 }
        ],
        macros: [
          { _id: new mongoose.Types.ObjectId().toString(), name: "protein", unit: "g", totalAmount: 24, amount100g: 8, amountPerServing: 24 },
          { _id: new mongoose.Types.ObjectId().toString(), name: "carbohydrates", unit: "g", totalAmount: 165, amount100g: 55, amountPerServing: 165 },
          { _id: new mongoose.Types.ObjectId().toString(), name: "fat", unit: "g", totalAmount: 6, amount100g: 2, amountPerServing: 6 },
          { _id: new mongoose.Types.ObjectId().toString(), name: "fiber", unit: "g", totalAmount: 6, amount100g: 2, amountPerServing: 6 },
          { _id: new mongoose.Types.ObjectId().toString(), name: "sugar", unit: "g", totalAmount: 3, amount100g: 1, amountPerServing: 3 }
        ],
        score: 65,
        grade: "C",
        nutrientLevels: {
          "sodium": "moderate",
          "saturated-fat": "low",
          "fiber": "moderate"
        }
      }
    ],
    userId: userId1,
    userName: "test-user",
    description: "Authentic Italian-style pizza with fresh ingredients",
    createdAt: new Date(),
    grade: "B",
    macros: [
      { _id: new mongoose.Types.ObjectId().toString(), name: "protein", unit: "g", totalAmount: 48.7, amount100g: 6.8, amountPerServing: 48.7 },
      { _id: new mongoose.Types.ObjectId().toString(), name: "carbohydrates", unit: "g", totalAmount: 176.5, amount100g: 24.6, amountPerServing: 176.5 },
      { _id: new mongoose.Types.ObjectId().toString(), name: "fat", unit: "g", totalAmount: 41, amount100g: 5.7, amountPerServing: 41 }
    ], 
    totalCalories: 1280
  };

  describe("POST /recipes", () => {
    it("should create a new recipe and return 201", async () => {
      const res = await request(app)
        .post("/recipes")
        .send(sampleRecipe)
        .expect("Content-Type", /json/)
        .expect(201);

      expect(res.body).toHaveProperty("_id");
      expect(res.body.name).toBe(sampleRecipe.name);
      expect(res.body.ingredients.length).toBe(4);
      expect(res.body.ingredients[0].name).toBe("Fresh Tomato");
      expect(res.body.ingredients[1].allergens).toContain("milk");

      const recipeInDb = await RecipeModel.findById(res.body._id);
      expect(recipeInDb).not.toBeNull();
      expect(recipeInDb?.name).toBe(sampleRecipe.name);
      expect(recipeInDb?.ingredients.length).toBe(4);
    });

    it("should create a recipe with multiple ingredients", async () => {
      const res = await request(app)
        .post("/recipes")
        .send(multiIngredientRecipe)
        .expect("Content-Type", /json/)
        .expect(201);

      expect(res.body.ingredients.length).toBe(5);
      expect(res.body.ingredients[4].name).toBe("Pizza Dough");
      expect(res.body.ingredients[4].allergens).toContain("wheat");
    });
  });

  describe("GET /recipes", () => {
    it("should return all recipes", async () => {
      await RecipeModel.create(sampleRecipe);
      await RecipeModel.create(anotherRecipe);

      const res = await request(app)
        .get("/recipes")
        .expect("Content-Type", /json/)
        .expect(200);

      expect(res.body.length).toBe(2);
      expect(res.body[0].name).toBe(sampleRecipe.name);
      expect(res.body[1].name).toBe(anotherRecipe.name);
    });

    it("should return empty array when no recipes exist", async () => {
      const res = await request(app)
        .get("/recipes")
        .expect("Content-Type", /json/)
        .expect(200);

      expect(res.body.length).toBe(0);
    });
  });

  describe("GET /recipes/:id", () => {
    it("should return the recipe when valid id", async () => {
      const created = await RecipeModel.create(sampleRecipe);
      const res = await request(app)
        .get(`/recipes/${created._id}`)
        .expect("Content-Type", /json/)
        .expect(200);

      expect(res.body._id).toBe(created._id.toString());
      expect(res.body.name).toBe(sampleRecipe.name);
      expect(res.body.ingredients.length).toBe(4);
      expect(res.body.ingredients[0]).toHaveProperty("calories");
      expect(res.body.ingredients[0]).toHaveProperty("macros");
      expect(res.body.ingredients[0]).toHaveProperty("nutrients");
    });

    it("should return 404 if recipe not found", async () => {
      const fakeId = new mongoose.Types.ObjectId();
      await request(app).get(`/recipes/${fakeId}`).expect(404);
    });
  });

  describe("PUT /recipes/:id/user/:userId", () => {
    it("should update the recipe and return 200", async () => {
      const created = await RecipeModel.create(sampleRecipe);
      const update = {
        name: "Updated Caprese Salad",
        ingredients: [tomatoFoodItem, cheeseFoodItem, basilFoodItem],
        userId: sampleRecipe.userId,
        userName: "test-user",
        description: "Updated description for Caprese Salad",
        createdAt: sampleRecipe.createdAt,
        grade: "A",
        macros: [
          { _id: new mongoose.Types.ObjectId().toString(), name: "protein", unit: "g", totalAmount: 24.4, amount100g: 7.8, amountPerServing: 24.4 },
          { _id: new mongoose.Types.ObjectId().toString(), name: "carbohydrates", unit: "g", totalAmount: 11.2, amount100g: 3.6, amountPerServing: 11.2 },
          { _id: new mongoose.Types.ObjectId().toString(), name: "fat", unit: "g", totalAmount: 21.5, amount100g: 6.9, amountPerServing: 21.5 }
        ], 
        totalCalories: 317
      };

      const res = await request(app)
        .put(`/recipes/${created._id}/user/${sampleRecipe.userId}`)
        .send(update)
        .expect("Content-Type", /json/)
        .expect(200);

      expect(res.body.name).toBe(update.name);
      expect(res.body.ingredients.length).toBe(3);
      
      const recipeInDb = await RecipeModel.findById(created._id);
      expect(recipeInDb?.name).toBe(update.name);
      expect(recipeInDb?.ingredients.length).toBe(3);
    });

    it("should update recipe with different ingredients", async () => {
      const created = await RecipeModel.create(sampleRecipe);
      const update = {
        name: "Simple Tomato Salad",
        ingredients: [tomatoFoodItem, oliveOilFoodItem],
        userId: sampleRecipe.userId,
        userName: "test-user",
        description: "A simple salad with tomato and olive oil",
        createdAt: sampleRecipe.createdAt,
        grade: "A",
        macros: [
          { _id: new mongoose.Types.ObjectId().toString(), name: "protein", unit: "g", totalAmount: 1.8, amount100g: 0.8, amountPerServing: 1.8 },
          { _id: new mongoose.Types.ObjectId().toString(), name: "carbohydrates", unit: "g", totalAmount: 7.8, amount100g: 3.6, amountPerServing: 7.8 },
          { _id: new mongoose.Types.ObjectId().toString(), name: "fat", unit: "g", totalAmount: 13.9, amount100g: 6.5, amountPerServing: 13.9 }
        ], 
        totalCalories: 155
      };

      const res = await request(app)
        .put(`/recipes/${created._id}/user/${sampleRecipe.userId}`)
        .send(update)
        .expect("Content-Type", /json/)
        .expect(200);

      expect(res.body.ingredients.length).toBe(2);
      expect(res.body.ingredients[0].name).toBe("Fresh Tomato");
      expect(res.body.ingredients[1].name).toBe("Extra Virgin Olive Oil");
    });

    it("should return 404 if recipe not found", async () => {
      const update = {
        name: "Updated Recipe",
        ingredients: [tomatoFoodItem],
        userId: sampleRecipe.userId,
        userName: "test-user",
        description: "Updated description",
        createdAt: new Date(),
        grade: "A",
        macros: [
          { _id: new mongoose.Types.ObjectId().toString(), name: "protein", unit: "g", totalAmount: 1.8, amount100g: 0.9, amountPerServing: 1.8 }
        ], 
        totalCalories: 36
      };
      const fakeId = new mongoose.Types.ObjectId();
      await request(app)
        .put(`/recipes/${fakeId}/user/${sampleRecipe.userId}`)
        .send(update)
        .expect(404);
    });
  });

  describe("DELETE /recipes/:id/user/:userId", () => {
    it("should delete the recipe and return 204", async () => {
      const created = await RecipeModel.create(sampleRecipe);

      await request(app)
        .delete(`/recipes/${created._id}/user/${sampleRecipe.userId}`)
        .expect(204);

      const recipeInDb = await RecipeModel.findById(created._id);
      expect(recipeInDb).toBeNull();
    });

    it("should return 404 if recipe not found", async () => {
      const fakeId = new mongoose.Types.ObjectId();
      await request(app)
        .delete(`/recipes/${fakeId}/user/${sampleRecipe.userId}`)
        .expect(404);
    });
  });

  describe("GET /recipes/user/:userId", () => {
    it("should return recipes for the given userId", async () => {
      await RecipeModel.create(sampleRecipe);
      await RecipeModel.create(multiIngredientRecipe);
      await RecipeModel.create(anotherRecipe);

      const res = await request(app)
        .get(`/recipes/user/${sampleRecipe.userId}`)
        .expect("Content-Type", /json/)
        .expect(200);

      expect(res.body.length).toBe(2);
      expect(res.body[0].userId).toBe(sampleRecipe.userId);
      expect(res.body[1].userId).toBe(sampleRecipe.userId);
    });

    it("should return empty array if user has no recipes", async () => {
      await RecipeModel.create(anotherRecipe);

      const res = await request(app)
        .get(`/recipes/user/${userId1}`)
        .expect("Content-Type", /json/)
        .expect(200);

      expect(res.body.length).toBe(0);
    });

    it("should return recipes with full ingredient details", async () => {
      await RecipeModel.create(sampleRecipe);

      const res = await request(app)
        .get(`/recipes/user/${sampleRecipe.userId}`)
        .expect("Content-Type", /json/)
        .expect(200);

      expect(res.body[0].ingredients[0]).toHaveProperty("calories");
      expect(res.body[0].ingredients[0]).toHaveProperty("allergens");
      expect(res.body[0].ingredients[0]).toHaveProperty("nutrients");
      expect(res.body[0].ingredients[0]).toHaveProperty("macros");
      expect(res.body[0].ingredients[0]).toHaveProperty("score");
      expect(res.body[0].ingredients[0]).toHaveProperty("grade");
    });
  });

  describe("GET /recipes/search/:query", () => {
  it("should return recipes matching an ingredient", async () => {
    await RecipeModel.create({
      _id: new mongoose.Types.ObjectId().toString(),
      name: "Tomato Pasta",
      ingredients: [tomatoFoodItem, basilFoodItem],
      description: "Fresh pasta with tomato",
      userId: userId1,
      userName: "Test User 1",
      createdAt: new Date(),
      grade: "A",
      macros: [],
      totalCalories: 300
    });

    const res = await request(app).get("/recipes/search/tomato");

    expect(res.status).toBe(200);
    expect(res.body.length).toBe(1);
    expect(res.body[0].name).toBe("Tomato Pasta");
  });

  it("should fallback to recipe name if ingredient returns empty", async () => {
    await RecipeModel.create({
      _id: new mongoose.Types.ObjectId().toString(),
      name: "Cheese Pizza",
      ingredients: [cheeseFoodItem],
      description: "Pizza with mozzarella",
      userId: userId1,
      userName: "Test User 1",
      createdAt: new Date(),
      grade: "B",
      macros: [],
      totalCalories: 700
    });

    const res = await request(app).get("/recipes/search/pizza");

    expect(res.status).toBe(200);
    expect(res.body.length).toBe(1);
    expect(res.body[0].name).toBe("Cheese Pizza");
  });

  it("should fallback to username if no ingredient nor recipe name matches", async () => {
    await RecipeModel.create({
      _id: new mongoose.Types.ObjectId().toString(),
      name: "Basil Salad",
      ingredients: [basilFoodItem],
      description: "Fresh basil salad",
      userId: userId2,
      userName: "Test User 2",
      createdAt: new Date(),
      grade: "A",
      macros: [],
      totalCalories: 120
    });

    const res = await request(app).get("/recipes/search/Test User 2");

    expect(res.status).toBe(200);
    expect(res.body.length).toBe(1);
    expect(res.body[0].userName).toBe("Test User 2");
  });

  it("should return an empty array if no ingredient, name or username match", async () => {
    const res = await request(app).get("/recipes/search/nope");

    expect(res.status).toBe(200);
    expect(res.body.length).toBe(0);
  });
});
});