import express from "express";
import {
  addTransaction,
  removeTransaction,
  getTransactions,
} from "../controllers/transactionController";
import { authenticateJWT } from "../middleware/auth";

const router = express.Router();

router.post("/add", authenticateJWT, addTransaction);
router.delete("/remove", authenticateJWT, removeTransaction);
router.get("/", authenticateJWT, getTransactions);

export default router;
