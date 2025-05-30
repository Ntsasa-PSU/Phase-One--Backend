import express from "express";
import {
  createLinkToken,
  exchangePublicToken,
  getTransactions,
} from "../controllers/plaidController";
import { authenticateJWT } from "../middleware/auth";

const router = express.Router();

router.post("/create-link-token", authenticateJWT, createLinkToken);
router.post("/exchange-token", authenticateJWT, exchangePublicToken);
router.get("/transactions", authenticateJWT, getTransactions);

export default router;
