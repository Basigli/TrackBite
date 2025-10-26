import request from "supertest";
import { beforeAll, afterAll, beforeEach, describe, it, expect } from '@jest/globals';
import mongoose from "mongoose";
import { MongoMemoryServer } from "mongodb-memory-server";
import { app } from "../../src/app";
import { DietModel } from "../../src/storage/DietSchema";

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
  await DietModel.deleteMany({});
});

describe("Diet Routes", () => {
  const sampleDiet = {
    name: "Low Carb",
    caloriesAmount: 1500,
    userId: "test-user-id"
  };

  describe("POST /diets", () => {
    it("should create a new diet and return 201", async () => {
      const res = await request(app)
        .post("/diets")
        .send(sampleDiet)
        .expect("Content-Type", /json/)
        .expect(201);

      expect(res.body).toHaveProperty("_id");
      expect(res.body.name).toBe(sampleDiet.name);
      expect(res.body.caloriesAmount).toBe(sampleDiet.caloriesAmount);

      const dietInDb = await DietModel.findById(res.body._id);
      expect(dietInDb).not.toBeNull();
    });
  });

  describe("GET /diets", () => {
    it("should return all diets", async () => {
      await DietModel.create(sampleDiet);

      const res = await request(app)
        .get("/diets")
        .expect("Content-Type", /json/)
        .expect(200);

      expect(res.body.length).toBe(1);
      expect(res.body[0].name).toBe(sampleDiet.name);
    });
  });

  describe("GET /diets/:id", () => {
    it("should return the diet when valid id", async () => {
      const created = await DietModel.create(sampleDiet);
      const res = await request(app)
        .get(`/diets/${created._id}`)
        .expect("Content-Type", /json/)
        .expect(200);

      expect(res.body._id).toBe(created._id.toString());
      expect(res.body.name).toBe(sampleDiet.name);
    });

    it("should return 404 if diet not found", async () => {
      const fakeId = new mongoose.Types.ObjectId();
      await request(app)
        .get(`/diets/${fakeId}`)
        .expect(404);
    });
  });

  describe("PUT /diets/:id", () => {
    it("should update the diet and return 200", async () => {
      const created = await DietModel.create(sampleDiet);
      const update = { name: "High Protein", caloriesAmount: 2000, userId: "test-user-id"};

      const res = await request(app)
        .put(`/diets/${created._id}`)
        .send(update)
        .expect("Content-Type", /json/)
        .expect(200);

      expect(res.body.name).toBe(update.name);
      expect(res.body.caloriesAmount).toBe(update.caloriesAmount);

      const dietInDb = await DietModel.findById(created._id);
      expect(dietInDb?.name).toBe(update.name);
      expect(dietInDb?.caloriesAmount).toBe(update.caloriesAmount);
    });

    it("should return 404 if diet not found", async () => {
      const fakeId = new mongoose.Types.ObjectId();
      await request(app)
        .put(`/diets/${fakeId}`)
        .send({ name: "Non-existent", caloriesAmount: 0, userId: "none" })
        .expect(404);
    });
  });

  describe("DELETE /diets/:id/user/:userId", () => {
    it("should delete the diet and return 204", async () => {
      const created = await DietModel.create(sampleDiet);

      await request(app)
        .delete(`/diets/${created._id}/user/${created.userId}`)
        .expect(204);

      const dietInDb = await DietModel.findById(created._id);
      expect(dietInDb).toBeNull();
    });

    it("should return 404 if diet not found", async () => {
      const fakeId = new mongoose.Types.ObjectId();
      await request(app)
        .delete(`/diets/${fakeId}`)
        .expect(404);
    });
  });

  describe("GET /diets/user/:userId", () => {
    it("should return diets for the specified user", async () => {
      const userId = "user-123";
      const otherUserId = "user-456";

      await DietModel.create([
        { name: "Diet A", caloriesAmount: 1200, userId },
        { name: "Diet B", caloriesAmount: 1500, userId },
        { name: "Diet C", caloriesAmount: 1800, userId: otherUserId }
      ]);

      const res = await request(app)
        .get(`/diets/user/${userId}`)
        .expect("Content-Type", /json/)
        .expect(200);

      expect(res.body.length).toBe(2);
      res.body.forEach((diet: any) => {
        expect(diet.userId).toBe(userId);
      });
    });
  });

});
