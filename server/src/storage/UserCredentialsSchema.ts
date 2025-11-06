import mongoose, { Schema } from 'mongoose';
import { UserCredentials } from '../models/UserCredentials';

const userCredentialsSchema = new Schema<UserCredentials>({
  nickname: { type: String, required: true, unique: true },
  passwordHash: { type: String, required: true },
});

const UserCredentialsModel = mongoose.model<UserCredentials>('UserCredentials', userCredentialsSchema);

export default UserCredentialsModel;
