import mongoose from "mongoose";

export interface IUser extends mongoose.Document {
  name?: string;
  email: string;
  dob?: string;
  provider: "email" | "google";
}

const userSchema = new mongoose.Schema<IUser>(
  {
    name: { type: String },
    email: { type: String, required: true, unique: true },
    dob: { type: String },
    provider: { type: String, enum: ["email", "google"], required: true },
  },
  { timestamps: true }
);

export default mongoose.models.User || mongoose.model<IUser>("User", userSchema);
