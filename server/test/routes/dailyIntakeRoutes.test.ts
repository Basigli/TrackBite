import request from "supertest";
import { beforeAll, afterAll, beforeEach, describe, it, expect } from '@jest/globals';
import mongoose from "mongoose";
import { MongoMemoryServer } from "mongodb-memory-server";
import { app } from "../../src/app";
import { DailyIntakeModel } from "../../src/storage/DailyIntakeSchema";

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
  await DailyIntakeModel.deleteMany({});
});

describe("DailyIntake Routes", () => {
  const sampleDailyIntake = {
    totalCalories: 2000,
    totalMacros: [],
    foodItems: [],
    date: new Date().toISOString()
  };

  const sampleFoodItem = {
    _id: new mongoose.Types.ObjectId().toString(),
    scannedItem: {
      _id: new mongoose.Types.ObjectId().toString(),
      name: "Apple",
      allergens: [],
      nutrients: [],
      ingredients: ["Apple"],
      score: 5,
      grade: "A",
      nutrientLevels: {}
    },
    percentage: 100
  };

  describe("POST /daily-intakes", () => {
    it("should create a new daily intake and return 201", async () => {
      const res = await request(app)
        .post("/daily-intakes")
        .send(sampleDailyIntake)
        .expect("Content-Type", /json/)
        .expect(201);

      expect(res.body).toHaveProperty("_id");
      expect(res.body.totalCalories).toBe(sampleDailyIntake.totalCalories);
    });
  });

  describe("GET /daily-intakes", () => {
    it("should return all daily intakes", async () => {
      await DailyIntakeModel.create(sampleDailyIntake);

      const res = await request(app)
        .get("/daily-intakes")
        .expect("Content-Type", /json/)
        .expect(200);

      expect(res.body.length).toBe(1);
      expect(res.body[0].totalCalories).toBe(sampleDailyIntake.totalCalories);
    });
  });

  describe("GET /daily-intakes/:id", () => {
    it("should return the daily intake when valid id", async () => {
      const created = await DailyIntakeModel.create(sampleDailyIntake);
      const res = await request(app)
        .get(`/daily-intakes/${created._id}`)
        .expect("Content-Type", /json/)
        .expect(200);

      expect(res.body._id).toBe(created._id.toString());
      expect(res.body.totalCalories).toBe(sampleDailyIntake.totalCalories);
    });

    it("should return 404 if daily intake not found", async () => {
      const fakeId = new mongoose.Types.ObjectId();
      await request(app)
        .get(`/daily-intakes/${fakeId}`)
        .expect(404);
    });
  });

  describe("PUT /daily-intakes/:id", () => {
    it("should update the daily intake and return 200", async () => {
      const created = await DailyIntakeModel.create(sampleDailyIntake);
      const update = { totalCalories: 1800, totalMacros: [], foodItems: [], date: new Date().toISOString() };

      const res = await request(app)
        .put(`/daily-intakes/${created._id}`)
        .send(update)
        .expect("Content-Type", /json/)
        .expect(200);

      expect(res.body.totalCalories).toBe(update.totalCalories);
      const intakeInDb = await DailyIntakeModel.findById(created._id);
      expect(intakeInDb?.totalCalories).toBe(update.totalCalories);
    });

    it("should return 404 if daily intake not found", async () => {
      const fakeId = new mongoose.Types.ObjectId();
      await request(app)
        .put(`/daily-intakes/${fakeId}`)
        .send({ totalCalories: 1000 })
        .expect(404);
    });
  });

  describe("DELETE /daily-intakes/:id", () => {
    it("should delete the daily intake and return 204", async () => {
      const created = await DailyIntakeModel.create(sampleDailyIntake);

      await request(app)
        .delete(`/daily-intakes/${created._id}`)
        .expect(204);

      const intakeInDb = await DailyIntakeModel.findById(created._id);
      expect(intakeInDb).toBeNull();
    });

    it("should return 404 if daily intake not found", async () => {
      const fakeId = new mongoose.Types.ObjectId();
      await request(app)
        .delete(`/daily-intakes/${fakeId}`)
        .expect(404);
    });
  });

  describe("Food Items routes", () => {
    it("should list food items in a daily intake", async () => {
      const created = await DailyIntakeModel.create({ ...sampleDailyIntake, foodItems: [sampleFoodItem] });

      const res = await request(app)
        .get(`/daily-intakes/${created._id}/food-items`)
        .expect("Content-Type", /json/)
        .expect(200);

      expect(res.body.length).toBe(1);
      expect(res.body[0]._id).toBe(sampleFoodItem._id);
    });

    it("should add a food item to a daily intake", async () => {
      const created = await DailyIntakeModel.create(sampleDailyIntake);

      const res = await request(app)
        .post(`/daily-intakes/${created._id}/food-items`)
        .send(sampleFoodItem)
        .expect("Content-Type", /json/)
        .expect(201);

      expect(res.body._id).toBe(sampleFoodItem._id);

      const intakeInDb = await DailyIntakeModel.findById(created._id);
      expect(intakeInDb?.foodItems.length).toBe(1);
      expect(intakeInDb?.foodItems[0]._id.toString()).toBe(sampleFoodItem._id);
    });

    it("should return 404 when adding a food item to non-existent daily intake", async () => {
      const fakeId = new mongoose.Types.ObjectId();
      await request(app)
        .post(`/daily-intakes/${fakeId}/food-items`)
        .send(sampleFoodItem)
        .expect(404);
    });
  });
});
