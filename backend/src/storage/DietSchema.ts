import mongoose, { Schema, Model } from "mongoose";
import { Diet } from "../models/Diet";

const DietSchema = new Schema<Diet>({
  name: { type: String, required: true, unique: true },
  caloriesAmount: { type: Number, required: true },
  userId: { type: String, required: true }
});

export const DietModel: Model<Diet> = mongoose.model<Diet>("Diet", DietSchema);
