import request from "supertest";
import mongoose from "mongoose";
import { beforeAll, afterAll, afterEach, describe, it, expect } from '@jest/globals';
import { MongoMemoryServer } from "mongodb-memory-server";
import {app} from "../src/app";
import { ScannedItemModel } from "../src/storage/ScannedItemSchema";

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
      name: "Apple",
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
  });

  it("GET /scanned-items - should return all scanned items", async () => {
    const item = new ScannedItemModel({ name: "Banana", allergens: [], nutrients: [], ingredients: ["banana"], score: 8, grade: "B", nutrientLevels: {} });
    await item.save();

    const res = await request(app).get("/scanned-items");

    expect(res.status).toBe(200);
    expect(res.body.length).toBe(1);
    expect(res.body[0].name).toBe("Banana");
  });

  it("GET /scanned-items/:id - should get a scanned item by id", async () => {
    const item = new ScannedItemModel({ name: "Orange", allergens: [], nutrients: [], ingredients: ["orange"], score: 9, grade: "A", nutrientLevels: {} });
    await item.save();

    const res = await request(app).get(`/scanned-items/${item._id}`);

    expect(res.status).toBe(200);
    expect(res.body.name).toBe("Orange");
  });

  it("PUT /scanned-items/:id - should update a scanned item", async () => {
    const item = new ScannedItemModel({ name: "Pear", allergens: [], nutrients: [], ingredients: ["pear"], score: 7, grade: "B", nutrientLevels: {} });
    await item.save();

    const res = await request(app).put(`/scanned-items/${item._id}`).send({ name: "Pear Updated" });

    expect(res.status).toBe(200);
    expect(res.body.name).toBe("Pear Updated");
  });

  it("DELETE /scanned-items/:id - should delete a scanned item", async () => {
    const item = new ScannedItemModel({ name: "Mango", allergens: [], nutrients: [], ingredients: ["mango"], score: 9, grade: "A", nutrientLevels: {} });
    await item.save();

    const res = await request(app).delete(`/scanned-items/${item._id}`);

    expect(res.status).toBe(204);

    const check = await ScannedItemModel.findById(item._id);
    expect(check).toBeNull();
  });
});
