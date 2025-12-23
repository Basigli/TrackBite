import { Request, Response } from "express";
import { UserModel } from "../storage/UserSchema";
import { UserSchemaZ } from "../models/User";
import UserCredentialsModel from "../storage/UserCredentialsSchema";
import { UserCredentialsSchemaZ } from "../models/UserCredentials";
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

// GET /users - Get all users
const getAllUsers = async (req: Request, res: Response) => {
  try {
    const users = await UserModel.find();
    res.status(200).json(users);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch users" });
  }
};

// POST /users - Create a new user
const createUser = async (req: Request, res: Response) => {
  try {
    const parsed = UserSchemaZ.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({ error: "Invalid user data", details: parsed.error });
    }

    const newUser = new UserModel(parsed.data);
    const savedUser = await newUser.save();
    
    // Hash the password before storing
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(req.body.passwordHash, saltRounds);
    
    const userCredentials = new UserCredentialsModel({
      nickname: savedUser.nickname,
      passwordHash: hashedPassword,
    });
    await userCredentials.save();
    res.status(201).json(savedUser);
  } catch (err: any) {
    if (err.code === 11000) {
      // Duplicate key error (unique constraint)
      return res.status(400).json({ error: "Email already exists" });
    }
    res.status(500).json({ error: "Failed to create user" });
  }
};

const logInUser = async (req: Request, res: Response) => {
  console.log('Request body:', req.body); // Debug log
  console.log('Content-Type:', req.headers['content-type']); // Debug log
  try {
    const parsed = UserCredentialsSchemaZ.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({ error: "Invalid user credentials", details: parsed.error });
    }
    const { nickname, passwordHash } = parsed.data;
    const userCredentials = await UserCredentialsModel.findOne({ nickname });
    if (!userCredentials) return res.status(404).json({ error: "User not found" });
    
    // Compare password with stored hash using bcrypt
    const isPasswordValid = await bcrypt.compare(passwordHash, userCredentials.passwordHash);
    if (!isPasswordValid) {
      return res.status(401).json({ error: "Invalid credentials" });
    }
    const user = await UserModel.findOne({ nickname });
    if (!user) return res.status(404).json({ error: "User not found" });
    // Generate JWT token
    const token = generateToken(user._id.toString(), nickname);
    res.status(200).json({ token, user });
  } catch (error) {
    res.status(500).json({ error: "Failed to log in user" });
  }
};

// GET /users/:id - Get user by ID
const getUserById = async (req: Request, res: Response) => {
  console.log('Fetching user with ID:', req.params.id); // Debug log
  try {
    const { id } = req.params;
    const user = await UserModel.findById(id);
    if (!user) return res.status(404).json({ error: "User not found" });
    res.status(200).json(user);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch user" });
  }
};

// PUT /users/:id - Update user
const updateUser = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    console.log(req.body);
    const parsed = UserSchemaZ.safeParse(req.body);
    console.log(parsed);
    if (!parsed.success) {
      return res.status(400).json({ error: "Invalid user data", details: parsed.error });
    }
    const updatedUser = await UserModel.findByIdAndUpdate(id, parsed.data, { new: true });
    if (!updatedUser) return res.status(404).json({ error: "User not found" });
    res.status(200).json(updatedUser);
  } catch (err: any) {
    if (err.code === 11000) {
      return res.status(400).json({ error: "Email already exists" });
    }
    res.status(500).json({ error: "Failed to update user" });
  }
};

// DELETE /users/:id - Delete user
const deleteUser = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const deletedUser = await UserModel.findByIdAndDelete(id);
    if (!deletedUser) return res.status(404).json({ error: "User not found" });
    res.status(204).send();
  } catch (err) {
    res.status(500).json({ error: "Failed to delete user" });
  }
};

// POST /users/:id/saved-recipes/:recipeId - Add recipe to saved recipes
const addSavedRecipe = async (req: Request, res: Response) => {
  try {
    const { id, recipeId } = req.params;
    const user = await UserModel.findById(id);
    if (!user) return res.status(404).json({ error: "User not found" });
    
    if (user.savedRecipesIds.includes(recipeId)) {
      return res.status(400).json({ error: "Recipe already saved" });
    }
    
    user.savedRecipesIds.push(recipeId);
    await user.save();
    res.status(200).json(user);
  } catch (err) {
    res.status(500).json({ error: "Failed to add saved recipe" });
  }
};

// DELETE /users/:id/saved-recipes/:recipeId - Remove recipe from saved recipes
const removeSavedRecipe = async (req: Request, res: Response) => {
  try {
    const { id, recipeId } = req.params;
    const user = await UserModel.findById(id);
    if (!user) return res.status(404).json({ error: "User not found" });
    
    user.savedRecipesIds = user.savedRecipesIds.filter(rid => rid !== recipeId);
    await user.save();
    res.status(200).json(user);
  } catch (err) {
    res.status(500).json({ error: "Failed to remove saved recipe" });
  }
};

// POST /users/:id/saved-scanned-items/:itemId - Add scanned item to saved items
const addSavedScannedItem = async (req: Request, res: Response) => {
  try {
    const { id, itemId } = req.params;
    const user = await UserModel.findById(id);
    if (!user) return res.status(404).json({ error: "User not found" });
    
    if (user.savedScannedItemsIds.includes(itemId)) {
      return res.status(400).json({ error: "Item already saved" });
    }
    
    user.savedScannedItemsIds.push(itemId);
    await user.save();
    res.status(200).json(user);
  } catch (err) {
    res.status(500).json({ error: "Failed to add saved scanned item" });
  }
};

// DELETE /users/:id/saved-scanned-items/:itemId - Remove scanned item from saved items
const removeSavedScannedItem = async (req: Request, res: Response) => {
  try {
    const { id, itemId } = req.params;
    const user = await UserModel.findById(id);
    if (!user) return res.status(404).json({ error: "User not found" });
    
    user.savedScannedItemsIds = user.savedScannedItemsIds.filter(iid => iid !== itemId);
    await user.save();
    res.status(200).json(user);
  } catch (err) {
    res.status(500).json({ error: "Failed to remove saved scanned item" });
  }
};

// PUT /users/:id/password - Change user password
const changePassword = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { currentPassword, newPassword } = req.body;
    
    const user = await UserModel.findById(id);
    if (!user) return res.status(404).json({ error: "User not found" });
    
    const userCredentials = await UserCredentialsModel.findOne({ nickname: user.nickname });
    if (!userCredentials) return res.status(404).json({ error: "Credentials not found" });
    
    // Verify current password using bcrypt
    const isPasswordValid = await bcrypt.compare(currentPassword, userCredentials.passwordHash);
    if (!isPasswordValid) {
      return res.status(401).json({ error: "Current password is incorrect" });
    }
    
    // Hash and update new password
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(newPassword, saltRounds);
    userCredentials.passwordHash = hashedPassword;
    await userCredentials.save();
    
    res.status(200).json({ message: "Password updated successfully" });
  } catch (err) {
    res.status(500).json({ error: "Failed to change password" });
  }
};

function generateToken(_id: string, nickname: string): string {
  // Lazy-require to avoid adding top-level imports if not already present
  // Uses JWT_SECRET from env, fallback to a dev secret (replace in production)
  // Token payload uses "sub" (subject) for the user id and expires in 1 hour
  const secret = process.env.JWT_SECRET || "replace_this_with_a_secure_secret";
  return jwt.sign({ 'id': _id, 'nickname': nickname }, secret, { expiresIn: "1h" });
}

export default {
  getAllUsers,
  createUser,
  logInUser,
  getUserById,
  updateUser,
  deleteUser,
  addSavedRecipe,
  removeSavedRecipe,
  addSavedScannedItem,
  removeSavedScannedItem,
  changePassword,
};