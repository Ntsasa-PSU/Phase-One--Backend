import express from "express";
import {
  addTransaction,
  removeTransaction,
  getTransactions,
} from "../controllers/transactionController";

const router = express.Router();

router.post("/add", addTransaction);
router.delete("/remove", removeTransaction);
router.get("/:userRef", getTransactions);

export default router;
