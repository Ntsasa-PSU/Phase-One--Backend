import express from "express";
import {
  createLinkToken,
  exchangePublicToken,
  getTransactions,
} from "../controllers/plaidController";

const router = express.Router();

router.post("/create-link-token", createLinkToken);
router.post("/exchange-token", exchangePublicToken);
router.get("/transactions", getTransactions);

export default router;
