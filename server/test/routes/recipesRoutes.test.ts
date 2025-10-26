import request from "supertest";
import { beforeAll, afterAll, beforeEach, describe, it, expect } from '@jest/globals';
import mongoose from "mongoose";
import { MongoMemoryServer } from "mongodb-memory-server";
import { app } from "../../src/app";
import { RecipeModel } from "../../src/storage/RecipeSchema";
import { FoodItem } from "../../src/models/FoodItem";

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

  const sampleRecipe = {
    name: "Test Recipe",
    ingredients: [
      {
        _id: new mongoose.Types.ObjectId().toString(),
        scannedItem: {
          _id: new mongoose.Types.ObjectId().toString(),
          name: "Tomato",
          allergens: [],
          nutrients: [],
          ingredients: ["Tomato"],
          score: 5,
          grade: "A",
          nutrientLevels: {} // se in schema usi Map, può diventare oggetto
        },
        percentage: 50
      }
    ]
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

      const recipeInDb = await RecipeModel.findById(res.body._id);
      expect(recipeInDb).not.toBeNull();
      expect(recipeInDb?.name).toBe(sampleRecipe.name);
    });
  });

  describe("GET /recipes", () => {
    it("should return all recipes", async () => {
      await RecipeModel.create(sampleRecipe);

      const res = await request(app)
        .get("/recipes")
        .expect("Content-Type", /json/)
        .expect(200);

      expect(res.body.length).toBe(1);
      expect(res.body[0].name).toBe(sampleRecipe.name);
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
    });

    it("should return 404 if recipe not found", async () => {
      const fakeId = new mongoose.Types.ObjectId();
      await request(app)
        .get(`/recipes/${fakeId}`)
        .expect(404);
    });
  });

  describe("PUT /recipes/:id", () => {
    it("should update the recipe and return 200", async () => {
      const created = await RecipeModel.create(sampleRecipe);
      const update = { name: "Updated Recipe", ingredients: sampleRecipe.ingredients };

      const res = await request(app)
        .put(`/recipes/${created._id}`)
        .send(update)
        .expect("Content-Type", /json/)
        .expect(200);

      expect(res.body.name).toBe(update.name);
      const recipeInDb = await RecipeModel.findById(created._id);
      expect(recipeInDb?.name).toBe(update.name);
    });

    it("should return 404 if recipe not found", async () => {
      const created = await RecipeModel.create(sampleRecipe);
      const update = { name: "Updated Recipe", ingredients: sampleRecipe.ingredients };
      const fakeId = new mongoose.Types.ObjectId();
      await request(app)
        .put(`/recipes/${fakeId}`)
        .send(update)
        .expect(404);
    });
  });

  describe("DELETE /recipes/:id", () => {
    it("should delete the recipe and return 204", async () => {
      const created = await RecipeModel.create(sampleRecipe);

      await request(app)
        .delete(`/recipes/${created._id}`)
        .expect(204);

      const recipeInDb = await RecipeModel.findById(created._id);
      expect(recipeInDb).toBeNull();
    });

    it("should return 404 if recipe not found", async () => {
      const fakeId = new mongoose.Types.ObjectId();
      await request(app)
        .delete(`/recipes/${fakeId}`)
        .expect(404);
    });
  });

});
