import { Request, Response } from "express";
import { RecipeModel } from "../storage/RecipeSchema";
import { Recipe, RecipeSchemaZ} from "../models/Recipe";
import io from "../ws-server";
import { UserModel } from "../storage/UserSchema";

// GET /recipes - List all recipes
 const getAllRecipes = async (_req: Request, res: Response) => {
  try {
    const recipes: Recipe[] = await RecipeModel.find();
    res.status(200).json(recipes);
  } catch (err) {
    res.status(500).json({ message: "Error fetching recipes", error: err });
  }
};

// POST /recipes - Create a new recipe
 const createRecipe = async (req: Request, res: Response) => {
  try {
    // console.log("Creating recipe with data:", req.body);
    const parsed = RecipeSchemaZ.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({ message: "Invalid recipe data", error: parsed.error });
    }
    const recipeData= parsed.data;
    const newRecipe = new RecipeModel(recipeData);
    await newRecipe.save();
    io.emit("recipe:new", newRecipe);
    res.status(201).json(newRecipe);
  } catch (err) {
    console.log("Error in createRecipe:", err);
    res.status(500).json({ message: "Error creating recipe", error: err });
  }
};

// GET /recipes/:id - Get a recipe by ID
 const getRecipeById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const recipe = await RecipeModel.findById(id);
    if (!recipe) return res.status(404).json({ message: "Recipe not found" });
    res.status(200).json(recipe);
  } catch (err) {
    res.status(500).json({ message: "Error fetching recipe", error: err });
  }
};

// PUT /recipes/:id/user/:userId - Update a recipe
 const updateRecipe = async (req: Request, res: Response) => {
  try {
    const id = req.params.id;
    const userId = req.params.userId;

    const parsed = RecipeSchemaZ.safeParse(req.body);
    if (!parsed.success) {
      console.log("Invalid recipe data:", parsed.error, req.body);
      return res.status(400).json({
        message: "Invalid recipe data",
        error: parsed.error,
      });
    }
    const updatedData = parsed.data;

    const recipe = await RecipeModel.findById(id);
    if (!recipe) {
      return res.status(404).json({ message: "Recipe not found" });
    }

    if (recipe.userId.toString() !== updatedData.userId) {
      return res.status(403).json({ message: "Forbidden: not your recipe" });
    }

    const updatedRecipe = await RecipeModel.findByIdAndUpdate(id, updatedData, {
      new: true,
      runValidators: true,
    });

    res.status(200).json(updatedRecipe);
  } catch (err) {
    console.error("Error in updateRecipe:", err);
    res.status(500).json({ message: "Error updating recipe", error: err });
  }
};

// DELETE /recipes/:id/user/:userId - Delete a recipe
 const deleteRecipe = async (req: Request, res: Response) => {
  try {
    const { id, userId } = req.params;
    const recipe = await RecipeModel.findById(id);
    if (!recipe) {
      return res.status(404).json({ message: "Recipe not found" });
    }

    if (recipe.userId.toString() !== userId) {
        const user = await UserModel.findById(userId);
        if (user?.savedRecipesIds.includes(id)) {
            user.savedRecipesIds = user.savedRecipesIds.filter(rId => rId.toString() !== id);
            await user.save();
        } else {  
      return res.status(403).json({ message: "Forbidden: not your recipe" });
    }}

    const deleted = await RecipeModel.findByIdAndDelete(id);
    if (!deleted) return res.status(404).json({ message: "Recipe not found" });
    res.status(204).send();
  } catch (err) {
      console.error("Error in deleting the recipe:", err);
    res.status(500).json({ message: "Error deleting recipe", error: err });
  }
};

// GET /recipes/user/:userId - Get recipes by User ID
const getRecipesByUserId = async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;
    const user = await UserModel.findById(userId);
    if (!user) {
      console.log("Not found user:", userId);
      return res.status(404).json({ message: "User not found" });
    }
    
    // Created by this user OR Saved by this user 
    const recipes = await RecipeModel.find({
      $or: [
        { userId: userId },
        { _id: { $in: user.savedRecipesIds } }
      ]
    });
    
    res.status(200).json(recipes);
  } catch (err) {
    console.log("Error in getRecipesByUserId:", err);
    res.status(500).json({ message: "Error fetching recipes for user", error: err });
  }
};

// GET /recipes/search/ingredient/:ingredient - Get recipes by Ingredient
 const getRecipesByIngredient = async (req: Request, res: Response) => {
  try {
    const ingredientName: string = req.params.ingredient;
    const recipes = await RecipeModel.find({ "ingredients.ingredients": { $regex: ingredientName, $options: 'i' } });
    res.status(200).json(recipes);
  } catch (err) {
    console.log("Error in getRecipesByIngredient:", err);
    res.status(500).json({ message: "Error fetching recipes by ingredient", error: err });
  }
};

export default {
  getAllRecipes,
  createRecipe,
  getRecipeById,
  updateRecipe,
  deleteRecipe,
  getRecipesByUserId,
  getRecipesByIngredient
};  