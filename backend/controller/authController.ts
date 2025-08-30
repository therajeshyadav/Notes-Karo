import jwt from "jsonwebtoken";
import { OAuth2Client } from "google-auth-library";
import User from "../models/User";
import OTP_STORE from "../utils/otpStore";
import { sendOtpEmail } from "../utils/mailer";

const JWT_SECRET = process.env.JWT_SECRET || "Braveman";
const googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

// 📌 Request OTP
export const requestOtp = async (req: any, res: any) => {
  const { email, mode } = req.body;

  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return res.status(400).json({ error: "Please provide a valid email." });
  }

  const existingUser = await User.findOne({ email });

  if (mode === "login" && !existingUser) {
    return res.status(404).json({ error: "User not found. Please sign up first." });
  }
  if (mode === "signup" && existingUser) {
    return res.status(400).json({ error: "User already exists. Please log in." });
  }

  const otp = String(Math.floor(100000 + Math.random() * 900000));
  OTP_STORE.set(email, otp);

  try {
    await sendOtpEmail(email, otp);
    return res.json({ success: true, message: "OTP sent to your email." });
  } catch {
    return res.status(500).json({ error: "Failed to send OTP email." });
  }
};

// 📌 Verify OTP
export const verifyOtp = async (req: any, res: any) => {
  const { email, otp, name, dob } = req.body;
  const expected = OTP_STORE.get(email);

  if (!expected) return res.status(400).json({ error: "No OTP requested." });
  if (expected !== otp) return res.status(401).json({ error: "Incorrect OTP." });

  OTP_STORE.delete(email);

  let user = await User.findOne({ email });
  if (!user) {
    user = await User.create({ email, name, dob, provider: "email" });
  }

  const token = jwt.sign(
    { sub: user.email, provider: user.provider, name: user.name, dob: user.dob },
    JWT_SECRET,
    { expiresIn: "2h" }
  );

  res.json({ token, user });
};

// 📌 Google Signup
export const googleSignup = async (req: any, res: any) => {
  const { credential } = req.body;
  const ticket = await googleClient.verifyIdToken({ idToken: credential, audience: process.env.GOOGLE_CLIENT_ID });
  const payload = ticket.getPayload();

  if (!payload) return res.status(401).json({ error: "Invalid Google token" });

  const { email, name } = payload;
  const existingUser = await User.findOne({ email });

  if (existingUser) return res.status(400).json({ error: "User already exists. Please login instead." });

  const newUser = await User.create({ email, name, provider: "google" });

  const token = jwt.sign(
    { sub: newUser.email, provider: newUser.provider, name: newUser.name },
    JWT_SECRET,
    { expiresIn: "2h" }
  );

  res.json({ success: true, token, user: newUser });
};

// 📌 Google Login
export const googleLogin = async (req: any, res: any) => {
  const { credential } = req.body;
  const ticket = await googleClient.verifyIdToken({ idToken: credential, audience: process.env.GOOGLE_CLIENT_ID });
  const payload = ticket.getPayload();

  if (!payload) return res.status(401).json({ error: "Invalid Google token" });

  const { email } = payload;
  const user = await User.findOne({ email });

  if (!user) return res.status(404).json({ error: "User not found. Please signup first." });

  const token = jwt.sign(
    { sub: user.email, provider: user.provider, name: user.name },
    JWT_SECRET,
    { expiresIn: "2h" }
  );

  res.json({ success: true, token, user });
};

// 📌 Get logged-in user
export const me = (req: any, res: any) => {
  const auth = req.headers.authorization || "";
  const token = auth.startsWith("Bearer ") ? auth.slice(7) : null;

  if (!token) return res.status(401).json({ error: "Missing token" });

  try {
    const payload = jwt.verify(token, JWT_SECRET) as any;
    return res.json({ user: payload });
  } catch {
    return res.status(401).json({ error: "Invalid token" });
  }
};
