import mongoose, { Schema, Model } from "mongoose";
import { Diet } from "../models/Diet";

const DietSchema = new Schema<Diet>({
  id: { type: Number },
  name: { type: String, required: true },
  caloriesAmount: { type: Number, required: true }
});

export const DietModel: Model<Diet> = mongoose.model<Diet>("Diet", DietSchema);
