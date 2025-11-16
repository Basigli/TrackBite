import { Request, Response } from "express";
import { UserModel } from "../storage/UserSchema";
import { UserSchemaZ } from "../models/User";
import UserCredentialsModel from "../storage/UserCredentialsSchema";
import { UserCredentialsSchemaZ } from "../models/UserCredentials";

// POST /users - Create a new user
export const createUser = async (req: Request, res: Response) => {
  try {
    const parsed = UserSchemaZ.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({ error: "Invalid user data", details: parsed.error });
    }
    const newUser = new UserModel(parsed.data);
    const savedUser = await newUser.save();
    const userCredentials = new UserCredentialsModel({
      _id: savedUser._id,
      nickname: savedUser.nickname,
      passwordHash: savedUser,
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

export const logInUser = async (req: Request, res: Response) => {
  try {
    const parsed = UserCredentialsSchemaZ.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({ error: "Invalid user credentials", details: parsed.error });
    }
    const { nickname, passwordHash } = parsed.data;
    const user = await UserCredentialsModel.findOne({ nickname });
    if (!user) return res.status(404).json({ error: "User not found" });
    // Compare passwordHash with user's stored passwordHash
    if (user.passwordHash !== passwordHash) {
      return res.status(401).json({ error: "Invalid credentials" });
    }
    // Generate JWT token
    const token = generateToken(user._id);
    res.status(200).json({ token });
  } catch (error) {
    res.status(500).json({ error: "Failed to log in user" });
  }

};

// GET /users/:id - Get user by ID
export const getUserById = async (req: Request, res: Response) => {
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
export const updateUser = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const parsed = UserSchemaZ.safeParse(req.body);
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
export const deleteUser = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const deletedUser = await UserModel.findByIdAndDelete(id);
    if (!deletedUser) return res.status(404).json({ error: "User not found" });
    res.status(204).send();
  } catch (err) {
    res.status(500).json({ error: "Failed to delete user" });
  }
};
