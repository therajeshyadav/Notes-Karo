import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "Braveman";

export const authenticateToken = (req: any, res: any, next: any) => {
  const auth = req.headers.authorization || "";
  const token = auth.startsWith("Bearer ") ? auth.slice(7) : null;

  if (!token) return res.status(401).json({ error: "Missing token" });

  try {
    const payload = jwt.verify(token, JWT_SECRET) as any;
    req.user = payload;
    next();
  } catch {
    return res.status(401).json({ error: "Invalid token" });
  }
};
