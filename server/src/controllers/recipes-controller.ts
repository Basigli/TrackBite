import { Request, Response } from "express";
import { RecipeModel } from "../storage/RecipeSchema";
import { Recipe, RecipeSchemaZ} from "../models/Recipe";

// GET /recipes - List all recipes
export const getAllRecipes = async (_req: Request, res: Response) => {
  try {
    const recipes: Recipe[] = await RecipeModel.find();
    res.status(200).json(recipes);
  } catch (err) {
    res.status(500).json({ message: "Error fetching recipes", error: err });
  }
};

// POST /recipes - Create a new recipe
export const createRecipe = async (req: Request, res: Response) => {
  try {
    const parsed = RecipeSchemaZ.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({ message: "Invalid recipe data", error: parsed.error });
    }
    const recipeData= parsed.data;
    const newRecipe = new RecipeModel(recipeData);
    await newRecipe.save();
    res.status(201).json(newRecipe);
  } catch (err) {
    res.status(500).json({ message: "Error creating recipe", error: err });
  }
};

// GET /recipes/:id - Get a recipe by ID
export const getRecipeById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const recipe = await RecipeModel.findById(id);
    if (!recipe) return res.status(404).json({ message: "Recipe not found" });
    res.status(200).json(recipe);
  } catch (err) {
    res.status(500).json({ message: "Error fetching recipe", error: err });
  }
};

// PUT /recipes/:id - Update a recipe
export const updateRecipe = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const parsed = RecipeSchemaZ.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({ message: "Invalid recipe data", error: parsed.error });
    }
    const updatedData = parsed.data;

    const updatedRecipe = await RecipeModel.findByIdAndUpdate(id, updatedData, {
      new: true,
      runValidators: true,
    });

    if (!updatedRecipe) return res.status(404).json({ message: "Recipe not found" });
    res.status(200).json(updatedRecipe);
  } catch (err) {
    res.status(500).json({ message: "Error updating recipe", error: err });
  }
};

// DELETE /recipes/:id - Delete a recipe
export const deleteRecipe = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const deleted = await RecipeModel.findByIdAndDelete(id);
    if (!deleted) return res.status(404).json({ message: "Recipe not found" });
    res.status(204).send();
  } catch (err) {
    res.status(500).json({ message: "Error deleting recipe", error: err });
  }
};