import { Request, Response } from "express";
import mongoose from "mongoose";

 const liveness = async (req: Request, res: Response)=> res.status(200).json({ status: "ok" });

 const readiness = async (req: Request, res: Response) => {
  const dbOk = await checkDatabaseConnection();
  if (dbOk) res.status(200).json({ status: "ok" });
  else res.status(500).json({ status: "error", db: "disconnected" });
};

async function checkDatabaseConnection() {
  try {
    const state = mongoose.connection.readyState;

    // 0 = disconnected, 1 = connected, 2 = connecting, 3 = disconnecting
    if (state === 1) return true;
    if (state === 0) {
      await mongoose.connect(process.env.MONGO_URI || "mongodb://localhost:27017/trackbite");
      return true;
    }

    return false;
  } catch (err) {
    console.error("Database connection check failed:", err);
    return false;
  }
}

export default { liveness, readiness };