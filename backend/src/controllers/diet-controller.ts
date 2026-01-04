import { Request, Response } from "express";
import { DietModel } from "../storage/DietSchema";
import { Diet, DietSchemaZ } from "../models/Diet";

// GET /diets - List all diets
 const getAllDiets = async (req: Request, res: Response) => {
  try {
    const diets = await DietModel.find();
    res.status(200).json(diets);
  } catch (error) {
    res.status(500).json({ message: "Error fetching diets", error });
  }
};

// POST /diets - Create a new diet
 const createDiet = async (req: Request, res: Response) => {
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
 const getDietById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const diet = await DietModel.findById(id);
    if (!diet) return res.status(404).json({ message: "Diet not found" });
    res.status(200).json(diet);
  } catch (error) {
    res.status(500).json({ message: "Error fetching diet", error });
  }
};

// PUT /diets/:id/user/:userId - Update a diet
 const updateDiet = async (req: Request, res: Response) => {
  try {
    const { userId, id } = req.params;
    const parsed = DietSchemaZ.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({ message: "Invalid diet data", error: parsed.error });
    }

    // retrieve user ID from the DB
    const diet = await DietModel.findById(id);
    if (!diet) return res.status(404).json({ message: "Diet not found" });

    if (diet.userId.toString() !== userId) {
      console.log("userId:", userId, "diet.userId:", diet.userId.toString());
      return res.status(403).json({ message: "Forbidden: not your diet" });
    }

    if (diet.userId.toString() !== userId) {
      return res
        .status(403)
        .json({ message: "Forbidden: you do not own this diet" });
    }

    const { name, caloriesAmount, macros } = parsed.data;
    const updatedDiet = await DietModel.findByIdAndUpdate(
      id,
      { name, caloriesAmount, macros },
      { new: true }
    );
    if (!updatedDiet) return res.status(404).json({ message: "Diet not found" });
    res.status(200).json(updatedDiet);
  } catch (error) {
    res.status(500).json({ message: "Error updating diet", error });
  }
};

// DELETE /diets/:id/user/:userId - Delete a diet
 const deleteDiet = async (req: Request, res: Response) => {
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
 const getDietsByUserId = async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;
    const diets = await DietModel.find({ userId });
    res.status(200).json(diets);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Error fetching diets for user", error });
  }
};

export default {
  getAllDiets,
  createDiet,
  getDietById,
  updateDiet,
  deleteDiet,
  getDietsByUserId,
};