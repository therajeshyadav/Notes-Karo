import Note from "../models/Notes";

export const getNotes = async (req: any, res: any) => {
  const notes = await Note.find({ userId: req.user.sub }).sort({ createdAt: -1 });
  res.json(notes);
};

export const createNote = async (req: any, res: any) => {
  const { title, content } = req.body;
  const note = await Note.create({ title, content, userId: req.user.sub });
  res.status(201).json(note);
};

export const deleteNote = async (req: any, res: any) => {
  const { id } = req.params;
  const note = await Note.findOneAndDelete({ _id: id, userId: req.user.sub });
  if (!note) return res.status(404).json({ error: "Note not found" });
  res.json({ message: "Note deleted successfully" });
};
