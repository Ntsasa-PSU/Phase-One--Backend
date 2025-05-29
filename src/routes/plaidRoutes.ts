import express from "express";
import {
  createLinkToken,
  exchangePublicToken,
  getTransactions,
} from "../controllers/plaidController";
import { authenticateFirebase } from "../middleware/auth";

const router = express.Router();

router.post("/create-link-token", authenticateFirebase, createLinkToken);
router.post("/exchange-token", authenticateFirebase, exchangePublicToken);
router.get("/transactions", authenticateFirebase, getTransactions);

export default router;
