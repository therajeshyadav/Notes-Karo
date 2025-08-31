import dotenv from "dotenv";
dotenv.config();
import express from "express";
import cors from "cors";
import connectDB from "../config/DB.js";
import authRoutes from "../routes/authRoutes.js";
import noteRoutes from "../routes/noteRoutes.js";

const app = express();


connectDB();


const allowedOrigins = [
  "http://localhost:3000",
  "http://localhost:3002",
  "http://localhost:5173",
  "https://note-karo-git-main-rajesh-s-projects-187b6c1a.vercel.app",
  "https://note-karo-2tq1mf6ha-rajesh-s-projects-187b6c1a.vercel.app",
  process.env.FRONTEND_URL || ""
];



app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        console.log("❌ Blocked by CORS:", origin);
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
  })
);

app.use(express.json());


app.use("/auth", authRoutes);
app.use("/notes", noteRoutes);


app.get("/health", (_, res) => res.json({ ok: true }));


const PORT = process.env.PORT || 4000;
app.listen(PORT, () =>
  console.log(`🚀 API running at http://localhost:${PORT}`)
);
