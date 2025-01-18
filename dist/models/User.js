import mongoose, { Schema } from "mongoose";
const userSchema = new Schema({
    userId: { type: String, required: true, unique: true },
    isOnline: { type: Boolean, default: false },
});
export default mongoose.models.User ||
    mongoose.model("User", userSchema);
