import { Request, Response } from "express";
import { UserModel } from "../storage/UserSchema";
import { DietModel } from "../storage/DietSchema";
import { DailyIntakeModel } from "../storage/DailyIntakeSchema";
import { RecipeModel } from "../storage/RecipeSchema";

export const getStats = async (req: Request, res: Response) => {
  const stats = {
    uptime: process.uptime(),
    memoryUsage: process.memoryUsage(),
    cpuUsage: process.cpuUsage(),
    nodeVersion: process.version,
    platform: process.platform,
    arch: process.arch,
  };

  res.status(200).json(stats);
}

export const getDbStats = async (req: Request, res: Response) => {
  try {
    const userCount = await UserModel.countDocuments();
    const dietCount = await DietModel.countDocuments();
    //const dailyIntakeCount = await DailyIntakeModel.countDocuments();
    const recipeCount = await RecipeModel.countDocuments();

    const dbStats = {
      users: userCount,
      diets: dietCount,
      //dailyIntakes: dailyIntakeCount,
      recipes: recipeCount,
    };

    res.status(200).json(dbStats);
  } catch (error) {
    res.status(500).json({ message: "Error retrieving database statistics", error });
  }
}