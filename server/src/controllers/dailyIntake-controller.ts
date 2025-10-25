import { Request, Response } from "express";
import { DailyIntakeModel } from "../storage/DailyIntakeSchema";
import { FoodItem } from "../models/FoodItem";

/**
 * GET /daily-intakes
 * List all daily intakes
 */
export const getAllDailyIntakes = async (req: Request, res: Response) => {
  try {
    const dailyIntakes = await DailyIntakeModel.find();
    res.status(200).json(dailyIntakes);
  } catch (error) {
    res.status(500).json({ message: "Error fetching daily intakes", error });
  }
};

/**
 * POST /daily-intakes
 * Create a new daily intake
 */
export const createDailyIntake = async (req: Request, res: Response) => {
  try {
    const newDailyIntake = new DailyIntakeModel(req.body);
    const saved = await newDailyIntake.save();
    res.status(201).json(saved);
  } catch (error) {
    res.status(400).json({ message: "Error creating daily intake", error });
  }
};


/**
 * GET /daily-intakes/:id
 * Get daily intake by ID
 */
export const getDailyIntakeById = async (req: Request, res: Response) => {
  try {
    const dailyIntake = await DailyIntakeModel.findById(req.params.id);
    if (!dailyIntake) {
      return res.status(404).json({ message: "Daily intake not found" });
    }
    res.status(200).json(dailyIntake);
  } catch (error) {
    res.status(500).json({ message: "Error fetching daily intake", error });
  }
};

/**
 * PUT /daily-intakes/:id
 * Update daily intake by ID
 */
export const updateDailyIntake = async (req: Request, res: Response) => {
  try {
    const updated = await DailyIntakeModel.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!updated) {
      return res.status(404).json({ message: "Daily intake not found" });
    }
    res.status(200).json(updated);
  } catch (error) {
    res.status(400).json({ message: "Error updating daily intake", error });
  }
};

/**
 * DELETE /daily-intakes/:id
 * Delete daily intake
 */
export const deleteDailyIntake = async (req: Request, res: Response) => {
  try {
    const deleted = await DailyIntakeModel.findByIdAndDelete(req.params.id);
    if (!deleted) {
      return res.status(404).json({ message: "Daily intake not found" });
    }
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ message: "Error deleting daily intake", error });
  }
};

/**
 * GET /daily-intakes/:dailyIntakeId/food-items
 * List food items in a daily intake
 */
export const getFoodItemsByDailyIntake = async (req: Request, res: Response) => {
  try {
    const dailyIntake = await DailyIntakeModel.findById(req.params.dailyIntakeId);
    if (!dailyIntake) {
      return res.status(404).json({ message: "Daily intake not found" });
    }
    res.status(200).json(dailyIntake.foodItems);
  } catch (error) {
    res.status(500).json({ message: "Error fetching food items", error });
  }
};

/**
 * POST /daily-intakes/:dailyIntakeId/food-items
 * Add a food item to a daily intake
 */
export const addFoodItemToDailyIntake = async (req: Request, res: Response) => {
  try {
    const { dailyIntakeId } = req.params;
    const foodItem: FoodItem = req.body;

    const dailyIntake = await DailyIntakeModel.findById(dailyIntakeId);
    if (!dailyIntake) {
      return res.status(404).json({ message: "Daily intake not found" });
    }

    dailyIntake.foodItems.push(foodItem);
    await dailyIntake.save();

    res.status(201).json(foodItem);
  } catch (error) {
    res.status(400).json({ message: "Error adding food item", error });
  }
};
