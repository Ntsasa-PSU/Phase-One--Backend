import jwt from "jsonwebtoken";
import { Request, Response, NextFunction, RequestHandler } from "express";

export interface AuthenticatedRequest extends Request {
  user?: { userId: string; email: string };
}

export const authenticateJWT: RequestHandler = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    res.status(401).json({ message: "Authorization header missing or malformed" });
    return; 
  }

  const token = authHeader.split(" ")[1];

  try {
    const secret = process.env.JWT_SECRET || "your_jwt_secret";
    const decoded = jwt.verify(token, secret) as { userId: string; email: string };
    (req as AuthenticatedRequest).user = decoded;
    next();
  } catch (error) {
    console.error("JWT verification failed:", error);
    res.status(403).json({ message: "Invalid or expired token" });
    return; 
  }
};