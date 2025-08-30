import express from "express";
import { requestOtp, verifyOtp, googleSignup, googleLogin, me } from "../controller/authController";

const router = express.Router();

router.post("/request-otp", requestOtp);
router.post("/verify-otp", verifyOtp);
router.post("/google/signup", googleSignup);
router.post("/google/login", googleLogin);
router.get("/me", me);

export default router;
