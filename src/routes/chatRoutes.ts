import express from "express";
import { chatWithGemini } from "../controllers/chatController";
import { authenticateFirebase } from "../middleware/auth";


const router = express.Router();

router.post("/", authenticateFirebase, async (req, res, next) => {
  try {
	await chatWithGemini(req, res);
  } catch (err) {
	next(err);
  }
});

export default router;
