import mongoose from "mongoose";

export interface INote extends mongoose.Document {
  title: string;
  content: string;
  userId: string;
}

const noteSchema = new mongoose.Schema<INote>(
  {
    title: { type: String, required: true },
    content: { type: String, required: true },
    userId: { type: String, required: true },
  },
  { timestamps: true }
);

export default mongoose.models.Note || mongoose.model<INote>("Note", noteSchema);
