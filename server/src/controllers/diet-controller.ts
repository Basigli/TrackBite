import { Request, Response } from "express";
import { DietModel } from "../storage/DietSchema";
import { Diet } from "../models/Diet";

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
    const { name, caloriesAmount } = req.body as Diet;
    const newDiet = new DietModel({ name, caloriesAmount });
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
    const { name, caloriesAmount } = req.body as Diet;
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

// DELETE /diets/:id - Delete a diet
export const deleteDiet = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const deleted = await DietModel.findByIdAndDelete(id);
    if (!deleted) return res.status(404).json({ message: "Diet not found" });
    res.sendStatus(204);
  } catch (error) {
    res.status(500).json({ message: "Error deleting diet", error });
  }
};
