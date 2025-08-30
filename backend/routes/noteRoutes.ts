import express from "express";
import { getNotes, createNote, deleteNote } from "../controller/noteController";
import { authenticateToken } from "../middleware/authMiddleware";

const router = express.Router();

router.get("/", authenticateToken, getNotes);
router.post("/", authenticateToken, createNote);
router.delete("/:id", authenticateToken, deleteNote);

export default router;
