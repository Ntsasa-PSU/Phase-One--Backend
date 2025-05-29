import { Request, Response, NextFunction } from "express";
import admin from "../config/firebase";

export interface AuthenticatedRequest extends Request {
  user?: admin.auth.DecodedIdToken;
}

export const authenticateFirebase = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    res.status(401).json({ message: "Authorization header missing or malformed" });
    return;
  }

  const idToken = authHeader.split(" ")[1];

  try {
    const decodedToken = await admin.auth().verifyIdToken(idToken);
    (req as AuthenticatedRequest).user = decodedToken;
    next(); // Success: proceed to next middleware
  } catch (error) {
    console.error("Firebase ID token verification failed:", error);
    res.status(403).json({ message: "Invalid or expired token" });
  }
};
