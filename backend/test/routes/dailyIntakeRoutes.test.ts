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
  const sampleFoodItem = {
    _id: new mongoose.Types.ObjectId().toString(),
    name: "Grilled Chicken Breast",
    quantity: "150g",
    calories: 165,
    allergens: ["soy"],
    ingredients: ["chicken breast", "olive oil", "salt", "pepper", "garlic"],
    nutrients: [
      {
        _id: new mongoose.Types.ObjectId().toString(),
        name: "vitamin-a",
        unit: "% DV",
        totalAmount: 2,
        amount100g: 1.33,
        amountPerServing: 2,
      },
      {
        _id: new mongoose.Types.ObjectId().toString(),
        name: "vitamin-c",
        unit: "% DV",
        totalAmount: 0,
        amount100g: 0,
        amountPerServing: 0,
      },
      {
        _id: new mongoose.Types.ObjectId().toString(),
        name: "calcium",
        unit: "% DV",
        totalAmount: 1,
        amount100g: 0.67,
        amountPerServing: 1,
      },
      {
        _id: new mongoose.Types.ObjectId().toString(),
        name: "iron",
        unit: "% DV",
        totalAmount: 4,
        amount100g: 2.67,
        amountPerServing: 4,
      },
      {
        _id: new mongoose.Types.ObjectId().toString(),
        name: "fiber",
        unit: "g",
        totalAmount: 0,
        amount100g: 0,
        amountPerServing: 0,
      },
      {
        _id: new mongoose.Types.ObjectId().toString(),
        name: "sodium",
        unit: "mg",
        totalAmount: 74,
        amount100g: 49.33,
        amountPerServing: 74,
      },
    ],
    macros: [
      {
        _id: new mongoose.Types.ObjectId().toString(),
        name: "protein",
        unit: "g",
        totalAmount: 31,
        amount100g: 20.67,
        amountPerServing: 31,
      },
      {
        _id: new mongoose.Types.ObjectId().toString(),
        name: "carbohydrates",
        unit: "g",
        totalAmount: 0,
        amount100g: 0,
        amountPerServing: 0,
      },
      {
        _id: new mongoose.Types.ObjectId().toString(),
        name: "fat",
        unit: "g",
        totalAmount: 3.6,
        amount100g: 2.4,
        amountPerServing: 3.6,
      },
      {
        _id: new mongoose.Types.ObjectId().toString(),
        name: "saturated-fat",
        unit: "g",
        totalAmount: 1,
        amount100g: 0.67,
        amountPerServing: 1,
      },
    ],
    score: 85,
    grade: "A",
    nutrientLevels: new Map([
      ["sodium", "low"],
      ["saturated-fat", "low"],
      ["sugar", "low"],
    ]),
  };

  const sampleFoodItem2 = {
    _id: new mongoose.Types.ObjectId().toString(),
    name: "Brown Rice",
    quantity: "1 cup cooked (195g)",
    calories: 218,
    allergens: [],
    ingredients: ["brown rice", "water"],
    nutrients: [
      {
        _id: new mongoose.Types.ObjectId().toString(),
        name: "vitamin-a",
        unit: "% DV",
        totalAmount: 0,
        amount100g: 0,
        amountPerServing: 0,
      },
      {
        _id: new mongoose.Types.ObjectId().toString(),
        name: "vitamin-c",
        unit: "% DV",
        totalAmount: 0,
        amount100g: 0,
        amountPerServing: 0,
      },
      {
        _id: new mongoose.Types.ObjectId().toString(),
        name: "calcium",
        unit: "% DV",
        totalAmount: 2,
        amount100g: 1.03,
        amountPerServing: 2,
      },
      {
        _id: new mongoose.Types.ObjectId().toString(),
        name: "iron",
        unit: "% DV",
        totalAmount: 5,
        amount100g: 2.56,
        amountPerServing: 5,
      },
      {
        _id: new mongoose.Types.ObjectId().toString(),
        name: "fiber",
        unit: "g",
        totalAmount: 3.5,
        amount100g: 1.79,
        amountPerServing: 3.5,
      },
      {
        _id: new mongoose.Types.ObjectId().toString(),
        name: "sodium",
        unit: "mg",
        totalAmount: 10,
        amount100g: 5.13,
        amountPerServing: 10,
      },
    ],
    macros: [
      {
        _id: new mongoose.Types.ObjectId().toString(),
        name: "protein",
        unit: "g",
        totalAmount: 4.5,
        amount100g: 2.31,
        amountPerServing: 4.5,
      },
      {
        _id: new mongoose.Types.ObjectId().toString(),
        name: "carbohydrates",
        unit: "g",
        totalAmount: 45.8,
        amount100g: 23.49,
        amountPerServing: 45.8,
      },
      {
        _id: new mongoose.Types.ObjectId().toString(),
        name: "fat",
        unit: "g",
        totalAmount: 1.6,
        amount100g: 0.82,
        amountPerServing: 1.6,
      },
      {
        _id: new mongoose.Types.ObjectId().toString(),
        name: "saturated-fat",
        unit: "g",
        totalAmount: 0.3,
        amount100g: 0.15,
        amountPerServing: 0.3,
      },
    ],
    score: 78,
    grade: "B",
    nutrientLevels: new Map([
      ["sodium", "low"],
      ["saturated-fat", "low"],
      ["sugar", "low"],
    ]),
  };

  const sampleTotalMacros = [
    {
      _id: new mongoose.Types.ObjectId().toString(),
      name: "protein",
      unit: "g",
      totalAmount: 35.5,
      amount100g: 23.7,
      amountPerServing: 35.5,
    },
    {
      _id: new mongoose.Types.ObjectId().toString(),
      name: "carbohydrates",
      unit: "g",
      totalAmount: 45.8,
      amount100g: 13.3,
      amountPerServing: 45.8,
    },
    {
      _id: new mongoose.Types.ObjectId().toString(),
      name: "fat",
      unit: "g",
      totalAmount: 5.2,
      amount100g: 1.5,
      amountPerServing: 5.2,
    },
    {
      _id: new mongoose.Types.ObjectId().toString(),
      name: "saturated-fat",
      unit: "g",
      totalAmount: 1.3,
      amount100g: 0.4,
      amountPerServing: 1.3,
    },
  ];

  const sampleDailyIntake = {
    totalCalories: 383,
    totalMacros: sampleTotalMacros,
    foodItems: [sampleFoodItem, sampleFoodItem2],
    date: new Date().toISOString(),
    userId: "test-user-1",
  };

  const emptyDailyIntake = {
    totalCalories: 0,
    totalMacros: [],
    foodItems: [],
    date: new Date().toISOString(),
    userId: "test-user-1",
  };

  describe("POST /daily-intakes", () => {
    it("should create a new daily intake and return 201", async () => {
      const res = await request(app)
        .post("/daily-intakes")
        .send(emptyDailyIntake)
        .expect("Content-Type", /json/)
        .expect(201);

      expect(res.body).toHaveProperty("_id");
      expect(res.body.totalCalories).toBe(emptyDailyIntake.totalCalories);
      expect(res.body.userId).toBe(emptyDailyIntake.userId);
    });

    it("should create a daily intake with food items and macros", async () => {
      const res = await request(app)
        .post("/daily-intakes")
        .send(sampleDailyIntake)
        .expect("Content-Type", /json/)
        .expect(201);

      expect(res.body).toHaveProperty("_id");
      expect(res.body.totalCalories).toBe(sampleDailyIntake.totalCalories);
      expect(res.body.foodItems.length).toBe(2);
      expect(res.body.totalMacros.length).toBe(4);
      expect(res.body.totalMacros[0]).toHaveProperty("_id");
      expect(res.body.totalMacros[0].name).toBe("protein");
      expect(res.body.totalMacros[0].totalAmount).toBe(35.5);
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
      expect(res.body[0].totalMacros.length).toBe(4);
    });

    it("should return empty array when no daily intakes exist", async () => {
      const res = await request(app)
        .get("/daily-intakes")
        .expect("Content-Type", /json/)
        .expect(200);

      expect(res.body.length).toBe(0);
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
      expect(res.body.foodItems.length).toBe(2);
      expect(res.body.totalMacros.length).toBe(4);
      expect(res.body.totalMacros[0].unit).toBe("g");
    });

    it("should return 404 if daily intake not found", async () => {
      const fakeId = new mongoose.Types.ObjectId();
      await request(app).get(`/daily-intakes/${fakeId}`).expect(404);
    });
  });

  describe("PUT /daily-intakes/:id", () => {
    it("should update the daily intake and return 200", async () => {
      const created = await DailyIntakeModel.create(emptyDailyIntake);
      const updateMacros = [
        {
          _id: new mongoose.Types.ObjectId().toString(),
          name: "protein",
          unit: "g",
          totalAmount: 120,
          amount100g: 30,
          amountPerServing: 120,
        },
        {
          _id: new mongoose.Types.ObjectId().toString(),
          name: "carbohydrates",
          unit: "g",
          totalAmount: 200,
          amount100g: 50,
          amountPerServing: 200,
        },
        {
          _id: new mongoose.Types.ObjectId().toString(),
          name: "fat",
          unit: "g",
          totalAmount: 60,
          amount100g: 15,
          amountPerServing: 60,
        },
      ];

      const update = {
        totalCalories: 1800,
        totalMacros: updateMacros,
        foodItems: [sampleFoodItem],
        date: new Date().toISOString(),
        userId: created.userId,
      };

      const res = await request(app)
        .put(`/daily-intakes/${created._id}`)
        .send(update)
        .expect("Content-Type", /json/)
        .expect(200);

      expect(res.body.totalCalories).toBe(update.totalCalories);
      expect(res.body.foodItems.length).toBe(1);
      expect(res.body.totalMacros.length).toBe(3);
      expect(res.body.totalMacros[0].totalAmount).toBe(120);

      const intakeInDb = await DailyIntakeModel.findById(created._id);
      expect(intakeInDb?.totalCalories).toBe(update.totalCalories);
    });

    it("should return 404 if daily intake not found", async () => {
      const fakeId = new mongoose.Types.ObjectId();
      const update = {
        totalCalories: 1800,
        totalMacros: [],
        foodItems: [],
        date: new Date().toISOString(),
        userId: "test-user-1",
      };
      await request(app)
        .put(`/daily-intakes/${fakeId}`)
        .send(update)
        .expect(404);
    });
  });

  describe("DELETE /daily-intakes/:id/user/:userId", () => {
    it("should delete the daily intake and return 204", async () => {
      const created = await DailyIntakeModel.create(sampleDailyIntake);

      await request(app)
        .delete(`/daily-intakes/${created._id}/user/${created.userId}`)
        .expect(204);

      const intakeInDb = await DailyIntakeModel.findById(created._id);
      expect(intakeInDb).toBeNull();
    });

    it("should return 404 if daily intake not found", async () => {
      const fakeId = new mongoose.Types.ObjectId();
      await request(app)
        .delete(`/daily-intakes/${fakeId}/user/test-user-1`)
        .expect(404);
    });
  });

  describe("Food Items routes", () => {
    it("should list food items in a daily intake", async () => {
      const created = await DailyIntakeModel.create(sampleDailyIntake);

      const res = await request(app)
        .get(`/daily-intakes/${created._id}/food-items`)
        .expect("Content-Type", /json/)
        .expect(200);

      expect(res.body.length).toBe(2);
      expect(res.body[0].name).toBe(sampleFoodItem.name);
      expect(res.body[1].name).toBe(sampleFoodItem2.name);
      expect(res.body[0].calories).toBe(165);
      expect(res.body[0].grade).toBe("A");
    });

    it("should return empty array for daily intake with no food items", async () => {
      const created = await DailyIntakeModel.create(emptyDailyIntake);

      const res = await request(app)
        .get(`/daily-intakes/${created._id}/food-items`)
        .expect("Content-Type", /json/)
        .expect(200);

      expect(res.body.length).toBe(0);
    });

    it("should add a food item to a daily intake", async () => {
      const created = await DailyIntakeModel.create(emptyDailyIntake);

      const res = await request(app)
        .post(`/daily-intakes/${created._id}/food-items`)
        .send(sampleFoodItem)
        .expect("Content-Type", /json/)
        .expect(201);

      expect(res.body._id).toBe(sampleFoodItem._id);
      expect(res.body.name).toBe(sampleFoodItem.name);
      expect(res.body.calories).toBe(sampleFoodItem.calories);

      const intakeInDb = await DailyIntakeModel.findById(created._id);
      expect(intakeInDb).not.toBeNull();
      expect(intakeInDb!.foodItems.length).toBe(1);

      const [firstFoodItem] = intakeInDb!.foodItems;
      expect(firstFoodItem._id!.toString()).toBe(sampleFoodItem._id);
      expect(firstFoodItem.name).toBe(sampleFoodItem.name);
    });

    it("should return 404 when adding a food item to non-existent daily intake", async () => {
      const fakeId = new mongoose.Types.ObjectId();
      await request(app)
        .post(`/daily-intakes/${fakeId}/food-items`)
        .send(sampleFoodItem)
        .expect(404);
    });
  });

  describe("GET /daily-intakes/history/user/:userId", () => {
    it("should return the daily intake history for a user", async () => {
      const today = new Date();
      const yesterday = new Date(today);
      yesterday.setDate(yesterday.getDate() - 1);

      await DailyIntakeModel.create({
        ...sampleDailyIntake,
        userId: "test-user-1",
        date: today.toISOString(),
      });
      await DailyIntakeModel.create({
        ...emptyDailyIntake,
        userId: "test-user-1",
        date: yesterday.toISOString(),
      });

      const res = await request(app)
        .get(`/daily-intakes/history/user/test-user-1`)
        .expect("Content-Type", /json/)
        .expect(200);

      expect(res.body.length).toBe(2);
      expect(res.body[0].userId).toBe("test-user-1");
    });

    it("should return 404 if user has no daily intake history", async () => {
      await request(app)
        .get(`/daily-intakes/history/user/non-existent-user`)
        .expect(404);
    });

    it("should only return daily intakes for the specified user", async () => {
      await DailyIntakeModel.create({
        ...sampleDailyIntake,
        userId: "test-user-1",
      });
      await DailyIntakeModel.create({
        ...emptyDailyIntake,
        userId: "test-user-2",
      });

      const res = await request(app)
        .get(`/daily-intakes/history/user/test-user-1`)
        .expect("Content-Type", /json/)
        .expect(200);

      expect(res.body.length).toBe(1);
      expect(res.body[0].userId).toBe("test-user-1");
    });

    it("should include macro details in history", async () => {
      await DailyIntakeModel.create({
        ...sampleDailyIntake,
        userId: "test-user-1",
      });

      const res = await request(app)
        .get(`/daily-intakes/history/user/test-user-1`)
        .expect("Content-Type", /json/)
        .expect(200);

      expect(res.body[0].totalMacros.length).toBeGreaterThan(0);
      expect(res.body[0].totalMacros[0]).toHaveProperty("_id");
      expect(res.body[0].totalMacros[0]).toHaveProperty("name");
      expect(res.body[0].totalMacros[0]).toHaveProperty("totalAmount");
      expect(res.body[0].totalMacros[0]).toHaveProperty("amount100g");
      expect(res.body[0].totalMacros[0]).toHaveProperty("amountPerServing");
    });
  });
});