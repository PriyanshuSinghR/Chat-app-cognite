import mongoose, { Document, Schema } from "mongoose";

export interface IUser extends Document {
  userId: string;
  isOnline: boolean;
}

const userSchema = new Schema({
  userId: { type: String, required: true, unique: true },
  isOnline: { type: Boolean, default: false },
});

export default mongoose.models.User ||
  mongoose.model<IUser>("User", userSchema);
