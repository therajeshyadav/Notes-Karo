import dotenv from "dotenv";
dotenv.config();
import express from "express";
import cors from "cors";
import connectDB from "../config/DB";
import authRoutes from "../routes/authRoutes";
import noteRoutes from "../routes/noteRoutes";

const app = express();
connectDB();

app.use(cors({ origin: ["http://localhost:3000", "http://localhost:3002", "http://localhost:5173",
                "https://note-karo-nqt331xis-rajesh-s-projects-187b6c1a.vercel.app"], credentials: true }));
app.use(express.json());

app.use("/auth", authRoutes);
app.use("/notes", noteRoutes);

app.get("/health", (_, res) => res.json({ ok: true }));

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`API running at http://localhost:${PORT}`));
