import express from "express";
import { chatWithGemini } from "../controllers/chatController";
import { authenticateJWT } from "../middleware/auth";


const router = express.Router();

router.post("/", authenticateJWT, async (req, res, next) => {
  try {
	await chatWithGemini(req, res);
  } catch (err) {
	next(err);
  }
});

export default router;
