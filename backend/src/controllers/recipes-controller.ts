import { Request, Response } from "express";
import { RecipeModel } from "../storage/RecipeSchema";
import { Recipe, RecipeSchemaZ} from "../models/Recipe";
import io from "../ws-server";
import { UserModel } from "../storage/UserSchema";
import { RecipeRatingService } from '../utils/RecipeRatingService';
import dotenv from 'dotenv';

dotenv.config();

const apiKey = process.env.GEMINI_API_KEY;
 
if (!apiKey) {
    throw new Error('GEMINI_API_KEY is not set in environment variables');
}
console.log('Using GEMINI_API_KEY:', apiKey.substring(0, 10) + '...');
const ratingService = new RecipeRatingService(apiKey);

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
    console.log("starting rating for recipe:", newRecipe._id);
    ratingService.rateRecipe(newRecipe)
      .then(async (rating) => {
        console.log("Received rating for recipe:", newRecipe._id, rating);
        newRecipe.recipeRating = rating;
        await RecipeModel.findByIdAndUpdate(newRecipe._id, newRecipe,
          { new: true, runValidators: true });
        io.emit("recipe:updated", newRecipe);
      })
      .catch((err) => {
        console.error("Error rating recipe:", err);
      });


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

// GET /recipes/search/:query - Search by ingredient → name → username
const queryRecipes = async (req: Request, res: Response) => {
  try {
    const query: string = req.params.query;

    // 1️⃣ Search by ingredient (in FoodItem objects)
    let recipes = await RecipeModel.find({
      "ingredients.ingredients": { $regex: query, $options: "i" }
    });

    // If not found, try recipe name
    if (recipes.length === 0) {
      recipes = await RecipeModel.find({
        name: { $regex: query, $options: "i" }
      });
    }

    // If still not found, try username
    if (recipes.length === 0) {
      recipes = await RecipeModel.find({
        userName: { $regex: query, $options: "i" }
      });
    }

    res.status(200).json(recipes);

  } catch (err) {
    console.log("Error in getRecipesByIngredient:", err);
    res.status(500).json({
      message: "Error searching recipes",
      error: err
    });
  }
};


// GET /recipes/community/:userId?limit - Get recipes from other users
const getCommunityRecipes = async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;
    const limit = parseInt(req.query.limit as string) || 50;
    
    const recipes = await RecipeModel
      .find({ userId: { $ne: userId } }) // Exclude user's own recipes
      .sort({ createdAt: -1 })
      .limit(limit);
    
    res.status(200).json(recipes);
  } catch (err) {
    res.status(500).json({ message: "Error fetching community recipes", error: err });
  }
};

export default {
  getAllRecipes,
  createRecipe,
  getRecipeById,
  updateRecipe,
  deleteRecipe,
  getRecipesByUserId,
  queryRecipes,
  getCommunityRecipes
};  