import mongoose, { Schema } from 'mongoose';
import { User } from '../models/User';

const UserSchema: Schema<User> = new Schema({
  nickname: { type: String, required: true },
  mail: { type: String, required: true, unique: true },
  savedRecipesIds: { type: [String], default: [] },
});

export const UserModel = mongoose.model<User>('User', UserSchema);