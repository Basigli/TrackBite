import { Request, Response } from "express";
import { DietModel } from "../storage/DietSchema";
import { Diet, DietSchemaZ } from "../models/Diet";

// GET /diets - List all diets
export const getAllDiets = async (req: Request, res: Response) => {
  try {
    const diets = await DietModel.find();
    res.status(200).json(diets);
  } catch (error) {
    res.status(500).json({ message: "Error fetching diets", error });
  }
};

// POST /diets - Create a new diet
export const createDiet = async (req: Request, res: Response) => {
  try {
    const parsed = DietSchemaZ.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({ message: "Invalid diet data", error: parsed.error });
    }
    const newDiet = new DietModel(parsed.data);
    await newDiet.save();
    res.status(201).json(newDiet);
  } catch (error) {
    res.status(500).json({ message: "Error creating diet", error });
  }
};

// GET /diets/:id - Get diet by ID
export const getDietById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const diet = await DietModel.findById(id);
    if (!diet) return res.status(404).json({ message: "Diet not found" });
    res.status(200).json(diet);
  } catch (error) {
    res.status(500).json({ message: "Error fetching diet", error });
  }
};

// PUT /diets/:id - Update a diet
export const updateDiet = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const parsed = DietSchemaZ.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({ message: "Invalid diet data", error: parsed.error });
    }

    // retrieve user ID from the DB
    const diet = await DietModel.findById(id);
    if (!diet) return res.status(404).json({ message: "Diet not found" });

    if (diet.userId.toString() !== parsed.data.userId) {
      return res.status(403).json({ message: "Forbidden: not your diet" });
    }

    const { name, caloriesAmount } = parsed.data;
    const updatedDiet = await DietModel.findByIdAndUpdate(
      id,
      { name, caloriesAmount },
      { new: true }
    );
    if (!updatedDiet) return res.status(404).json({ message: "Diet not found" });
    res.status(200).json(updatedDiet);
  } catch (error) {
    res.status(500).json({ message: "Error updating diet", error });
  }
};

// DELETE /diets/:id/user/:userId - Delete a diet
export const deleteDiet = async (req: Request, res: Response) => {
  try {
    const { id, userId } = req.params;

    const diet = await DietModel.findById(id);
    if (!diet) return res.status(404).json({ message: "Diet not found" });

    if (diet.userId.toString() !== userId) {
      return res.status(403).json({ message: "Forbidden: not your diet" });
    }

    const deleted = await DietModel.findByIdAndDelete(id);
    if (!deleted) return res.status(404).json({ message: "Diet not found" });
    res.sendStatus(204);
  } catch (error) {
    res.status(500).json({ message: "Error deleting diet", error });
  }
};

// GET /diets/user/:userId - Get diets by User ID
export const getDietsByUserId = async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;
    const diets = await DietModel.find({ userId });
    res.status(200).json(diets);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Error fetching diets for user", error });
  }
};