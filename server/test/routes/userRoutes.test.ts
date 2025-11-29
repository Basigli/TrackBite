import request from "supertest";
import { beforeAll, afterAll, beforeEach, describe, it, expect } from '@jest/globals';
import mongoose from "mongoose";
import { MongoMemoryServer } from "mongodb-memory-server";
import { app } from "../../src/app";
import { UserModel } from "../../src/storage/UserSchema";
import UserCredentialsModel from "../../src/storage/UserCredentialsSchema";

let mongoServer: MongoMemoryServer;
let authToken: string;

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
  await UserModel.deleteMany({});
});

describe("User Routes", () => {
  describe("POST /users", () => {
    it("should create a new user and return 201", async () => {
      const newUser = { nickname: "testuser", mail: "test@example.com", savedRecipesIds: [], password: "securepassword123" };
      const res = await request(app)
        .post("/users")
        .send(newUser)
        .expect("Content-Type", /json/)
        .expect(201);

      expect(res.body).toHaveProperty("_id");
      expect(res.body.nickname).toBe(newUser.nickname);
      expect(res.body.mail).toBe(newUser.mail);
      
      // verify in DB
      const userInDb = await UserModel.findOne({ mail: newUser.mail });
      expect(userInDb).not.toBeNull();
      const credentialsInDb = await UserCredentialsModel.findOne({ nickname: newUser.nickname });
      expect(credentialsInDb).not.toBeNull();
    });

    it("should return 400 when mail is duplicate", async () => {
      const user = {  nickname: "u1", mail: "dup@example.com" };
      await UserModel.create(user);

      const res = await request(app)
        .post("/users")
        .send({ nickname: "u2", mail: "dup@example.com" })
        .expect("Content-Type", /json/)
        .expect(400);

      expect(res.body).toHaveProperty("error");
    });
  });

  describe("POST /users/login", () => {
    it("should log in the user and return 200", async () => {
      const password = "passwordAlice";
      const user = { nickname: "alice", passwordHash: password };
      await UserCredentialsModel.create(user);

      const res = await request(app)
        .post("/users/login")
        .send({ nickname: user.nickname, passwordHash: password })
        .expect("Content-Type", /json/)
        .expect(200);

      expect(res.body).toHaveProperty("token");
      authToken = res.body.token; // Save token for future authenticated requests
    });
  });

  describe("POST /users/login", () => {
    it("should return 404 when user not found", async () => {
      const res = await request(app)
        .post("/users/login")
        .send({ nickname: "nonexistent", passwordHash: "anyPassword" })
        .expect("Content-Type", /json/)
        .expect(404);

      expect(res.body).toHaveProperty("error");
    });

    it("should return 401 when password is incorrect", async () => {
      const password = "correctPassword";
      const user = { nickname: "alice", passwordHash: password };
      await UserCredentialsModel.create(user);

      const res = await request(app)
        .post("/users/login")
        .send({ nickname: user.nickname, passwordHash: "wrongPassword" })
        .expect("Content-Type", /json/)
        .expect(401);

      expect(res.body).toHaveProperty("error");
    });
  });


  describe("GET /users/:id", () => {
    it("should return the user when valid id", async () => {
      const created = await UserModel.create({ nickname: "a", mail: "a@example.com" });
      const res = await request(app)
        .get(`/users/${created._id}`)
        .set("Authorization", `Bearer ${authToken}`)
        .expect("Content-Type", /json/)
        .expect(200);

      expect(res.body._id).toBe(created._id.toString());
      expect(res.body.mail).toBe("a@example.com");
    });

    it("should return 404 when user not found", async () => {
      const fakeId = new mongoose.Types.ObjectId();
      await request(app)
        .get(`/users/${fakeId}`)
        .set("Authorization", `Bearer ${authToken}`)
        .expect(404);
    });
  });

  describe("PUT /users/:id", () => {
    it("should update the user and return 200", async () => {
      const created = await UserModel.create({ nickname: "old", mail: "old@example.com", savedRecipesIds: [] });
      const update = {  _id: created._id, nickname: "newnick", mail: "old@example.com", savedRecipesIds: [] };
      const res = await request(app)
        .put(`/users/${created._id}`)
        .set("Authorization", `Bearer ${authToken}`)
        .send(update)
        .expect("Content-Type", /json/)
        .expect(200);

      expect(res.body.nickname).toBe(update.nickname);
      // verify in DB
      const userInDb = await UserModel.findById(created._id);
      expect(userInDb?.nickname).toBe(update.nickname);
    });

    it("should return 400 if updating mail to one that exists", async () => {
      await UserModel.create({ nickname: "u1", mail: "m1@example.com" });
      const created2 = await UserModel.create({ nickname: "u2", mail: "m2@example.com" });

      await request(app)
        .put(`/users/${created2._id}`)
        .set("Authorization", `Bearer ${authToken}`)
        .expect(400);
    });
  });

  describe("DELETE /users/:id", () => {
    it("should delete the user and return 204", async () => {
      const created = await UserModel.create({ nickname: "toDelete", mail: "td@example.com" });

      await request(app)
        .delete(`/users/${created._id}`)
        .set("Authorization", `Bearer ${authToken}`)
        .expect(204);

      const userInDb = await UserModel.findById(created._id);
      expect(userInDb).toBeNull();
    });

    it("should return 404 when deleting non-existent user", async () => {
      const fakeId = new mongoose.Types.ObjectId();
      await request(app)
        .delete(`/users/${fakeId}`)
        .set("Authorization", `Bearer ${authToken}`)
        .expect(404);
    });
  });
});
