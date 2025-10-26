import { beforeAll, afterAll, beforeEach, describe, it, expect } from '@jest/globals';
import request from "supertest";
import { app } from "../src/app";

describe("Metrics API", () => {
  it("should return 200 and prometheus content-type", async () => {
    const res = await request(app).get("/metrics");
    expect(res.status).toBe(200);
    expect(res.headers["content-type"]).toMatch(/text\/plain/);
    expect(res.text).toContain("# HELP");
  });

  it("should return 200 and status ok", async () => {
    const res = await request(app).get("/health/liveness");
    expect(res.status).toBe(200);
    expect(res.body).toEqual({ status: "ok" });
  });

  it("should return stasts with uptime and memory usage", async () => {
    const res = await request(app).get("/stats");
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty("uptime");
    expect(res.body).toHaveProperty("memoryUsage");
  });

  it("should return database stats", async () => {
    const res = await request(app).get("/stats/db");
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty("users");
    expect(res.body).toHaveProperty("diets");
    expect(res.body).toHaveProperty("dailyIntakes");
    expect(res.body).toHaveProperty("recipes");
  }, 10000);
});
