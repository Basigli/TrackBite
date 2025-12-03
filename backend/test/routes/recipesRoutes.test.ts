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

let mongoServer: MongoMemoryServer;

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
});

describe("Recipe Routes", () => {
  const tomatoFoodItem = {
    _id: new mongoose.Types.ObjectId().toString(),
    name: "Fresh Tomato",
    quantity: "200g",
    calories: 36,
    allergens: [],
    ingredients: ["tomato"],
    nutrients: {
      "vitamin-a": "20% DV",
      "vitamin-c": "28% DV",
      "vitamin-k": "10% DV",
      "potassium": "292mg",
      "fiber": "2.2g",
      "folate": "8% DV"
    },
    macros: {
      "protein": "1.8g",
      "carbohydrates": "7.8g",
      "fat": "0.4g",
      "sugar": "5.3g"
    },
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
    nutrients: {
      "calcium": "50% DV",
      "vitamin-a": "10% DV",
      "vitamin-b12": "15% DV",
      "phosphorus": "35% DV",
      "zinc": "18% DV",
      "selenium": "25% DV"
    },
    macros: {
      "protein": "22g",
      "carbohydrates": "3.1g",
      "fat": "21g",
      "saturated-fat": "13g"
    },
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
    nutrients: {
      "vitamin-k": "43% DV",
      "vitamin-a": "6% DV",
      "manganese": "8% DV",
      "iron": "3% DV",
      "calcium": "2% DV"
    },
    macros: {
      "protein": "0.3g",
      "carbohydrates": "0.3g",
      "fat": "0.1g",
      "fiber": "0.2g"
    },
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
    nutrients: {
      "vitamin-e": "13% DV",
      "vitamin-k": "8% DV",
      "iron": "2% DV"
    },
    macros: {
      "protein": "0g",
      "carbohydrates": "0g",
      "fat": "13.5g",
      "saturated-fat": "1.9g",
      "monounsaturated-fat": "9.9g"
    },
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
    nutrients: {
      "vitamin-c": "5% DV",
      "vitamin-b6": "6% DV",
      "manganese": "8% DV",
      "selenium": "4% DV",
      "calcium": "2% DV"
    },
    macros: {
      "protein": "0.6g",
      "carbohydrates": "3g",
      "fat": "0.05g",
      "fiber": "0.2g"
    },
    score: 88,
    grade: "A",
    niutrientLevels: {
      "sodium": "low",
      "saturated-fat": "low",
      "sugar": "low"
    }
  };

  const sampleRecipe = {
    name: "Caprese Salad",
    ingredients: [tomatoFoodItem, cheeseFoodItem, basilFoodItem, oliveOilFoodItem],
    userId: "test-user-id",
  };

  const anotherRecipe = {
    name: "Tomato Garlic Pasta Sauce",
    ingredients: [tomatoFoodItem, garlicFoodItem, oliveOilFoodItem, basilFoodItem],
    userId: "another-user-id",
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
        nutrients: {
          "iron": "25% DV",
          "thiamin": "35% DV",
          "niacin": "30% DV",
          "folate": "45% DV",
          "selenium": "40% DV"
        },
        macros: {
          "protein": "24g",
          "carbohydrates": "165g",
          "fat": "6g",
          "fiber": "6g",
          "sugar": "3g"
        },
        score: 65,
        grade: "C",
        nutrientLevels: {
          "sodium": "moderate",
          "saturated-fat": "low",
          "fiber": "moderate"
        }
      }
    ],
    userId: "test-user-id",
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
        .get(`/recipes/user/non-existent-user`)
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

  describe("GET /recipes/search/ingredient/:ingredient", () => {
    it("should return recipes containing the specified ingredient", async () => {
      await RecipeModel.create(sampleRecipe);
      await RecipeModel.create(anotherRecipe);
      await RecipeModel.create(multiIngredientRecipe);

      const res = await request(app)
        .get(`/recipes/search/ingredient/tomato`)
        .expect("Content-Type", /json/)
        .expect(200);

      expect(res.body.length).toBe(3);
      res.body.forEach((recipe: any) => {
        const hasIngredient = recipe.ingredients.some(
          (ing: any) => ing.ingredients.includes("tomato")
        );
        expect(hasIngredient).toBe(true);
      });
    });

    it("should return recipes containing cheese", async () => {
      await RecipeModel.create(sampleRecipe);
      await RecipeModel.create(anotherRecipe);
      await RecipeModel.create(multiIngredientRecipe);

      const res = await request(app)
        .get(`/recipes/search/ingredient/milk`)
        .expect("Content-Type", /json/)
        .expect(200);

      expect(res.body.length).toBe(2);
    });

    it("should return empty array if no recipes contain the ingredient", async () => {
      await RecipeModel.create(sampleRecipe);

      const res = await request(app)
        .get(`/recipes/search/ingredient/peanuts`)
        .expect("Content-Type", /json/)
        .expect(200);

      expect(res.body.length).toBe(0);
    });

    it("should search case-insensitively", async () => {
      await RecipeModel.create(sampleRecipe);

      const res = await request(app)
        .get(`/recipes/search/ingredient/BASIL`)
        .expect("Content-Type", /json/)
        .expect(200);

      expect(res.body.length).toBeGreaterThan(0);
    });
  });
});