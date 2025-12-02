import request from "supertest";
import mongoose from "mongoose";
import { beforeAll, afterAll, afterEach, describe, it, expect } from '@jest/globals';
import { MongoMemoryServer } from "mongodb-memory-server";
import {app} from "../../src/app";
import { ScannedItemModel } from "../../src/storage/ScannedItemSchema";

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

afterEach(async () => {
  await ScannedItemModel.deleteMany({});
});

describe("Scanned Items Routes", () => {
  it("POST /scanned-items - should create a new scanned item", async () => {
    const newItem = {
      barcode: "1234567890123",
      name: "Apple",
      quantity: 200,
      quantityPerServing: 100,
      quantityUnit: "g",
      allergens: [],
      nutrients: [],
      ingredients: ["apple"],
      score: 10,
      grade: "A",
      nutrientLevels: {}
    };
    const res = await request(app).post("/scanned-items").send(newItem);
    expect(res.status).toBe(201);
    expect(res.body.name).toBe("Apple");
    expect(res.body.quantity).toBe(200);
  });

  it("GET /scanned-items - should return all scanned items", async () => {
    const item = new ScannedItemModel({ 
      barcode: "5555555555555",
      name: "Banana", 
      quantity: 150,
      quantityPerServing: 75,
      quantityUnit: "g",
      allergens: [], 
      nutrients: [], 
      ingredients: ["banana"], 
      score: 8, 
      grade: "B", 
      nutrientLevels: {} 
    });
    await item.save();
    const res = await request(app).get("/scanned-items");
    expect(res.status).toBe(200);
    expect(res.body.length).toBe(1);
    expect(res.body[0].name).toBe("Banana");
  });

  it("GET /scanned-items/:id - should get a scanned item by id", async () => {
    const item = new ScannedItemModel({
      barcode: "9876543210987",
      name: "Orange", 
      quantity: 180,
      quantityPerServing: 90,
      quantityUnit: "g",
      allergens: [], 
      nutrients: [], 
      ingredients: ["orange"], 
      score: 9, 
      grade: "A", 
      nutrientLevels: {} 
    });
    await item.save();
    const res = await request(app).get(`/scanned-items/${item.barcode}`);
    expect(res.status).toBe(200);
    expect(res.body.name).toBe("Orange");
  });

  it("PUT /scanned-items/:id - should update a scanned item", async () => {
    const item = new ScannedItemModel({ 
      barcode: "2468101214161",
      name: "Pear Updated", 
      quantity: 250,
      quantityPerServing: 125,
      quantityUnit: "g",
      allergens: ["none"], 
      nutrients: [
        {
          name: "Iron", 
          unit: "mg", 
          totalAmount: 5, 
          amount100g: 0.5,
          amountPerServing: 0.625
        }
      ], 
      ingredients: ["pear"], 
      score: 7, 
      grade: "B", 
      nutrientLevels: {"iron": "high"} 
    });
    await item.save();
    const res = await request(app).put(`/scanned-items/${item.barcode}`).send(item.toJSON());
    expect(res.status).toBe(200);
    expect(res.body.name).toBe("Pear Updated");
  });

  it("DELETE /scanned-items/:id - should delete a scanned item", async () => {
    const item = new ScannedItemModel({ 
      barcode: "3210987654321",
      name: "Mango", 
      quantity: 300,
      quantityPerServing: 150,
      quantityUnit: "g",
      allergens: [], 
      nutrients: [], 
      ingredients: ["mango"], 
      score: 9, 
      grade: "A", 
      nutrientLevels: {} 
    });
    await item.save();
    const res = await request(app).delete(`/scanned-items/${item.barcode}`);
    expect(res.status).toBe(204);
    const check = await ScannedItemModel.findOne({ barcode: item.barcode });
    expect(check).toBeNull();
  });
});