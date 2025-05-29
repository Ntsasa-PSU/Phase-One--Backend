import express from "express";
import {
  addTransaction,
  removeTransaction,
  getTransactions,
} from "../controllers/transactionController";
import { authenticateFirebase } from "../middleware/auth";

const router = express.Router();

router.post("/add", authenticateFirebase, addTransaction);
router.delete("/remove", authenticateFirebase, removeTransaction);
router.get("/", authenticateFirebase, getTransactions);

export default router;
