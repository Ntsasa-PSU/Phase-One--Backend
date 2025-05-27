import { Request, Response } from "express";
import { plaidClient } from "../config/plaid";
import { Products, CountryCode } from "plaid";
import User from "../models/User";

// 1. Create Link Token
export const createLinkToken = async (req: Request, res: Response) => {
    const { userRef } = req.body; // or req.params or possibly req.query (ask FE how storing userRef)
  
    if (!userRef) {
      res.status(400).json({ message: "Missing userRef" });
      return;
    }
  
    try {
      const user = await User.findOne({ ref: userRef });
      if (!user) {
        res.status(404).json({ message: "User not found" });
        return;
      }
  
      const response = await plaidClient.linkTokenCreate({
        user: { client_user_id: user._id.toString() },
        client_name: "Finance App",
        products: [Products.Transactions],
        country_codes: [CountryCode.Us],
        language: "en",
      });
  
      res.json({ link_token: response.data.link_token });
    } catch (err) {
      console.error("Link token error:", err);
      res.status(500).json({ message: "Failed to create link token", error: err });
    }
  };



// 2. Exchange Public Token
export const exchangePublicToken = async (req: Request, res: Response) => {
  const { public_token } = req.body;
  try {
    const response = await plaidClient.itemPublicTokenExchange({ public_token });
    const access_token = response.data.access_token;
    // Store access_token in DB associated with userRef
    res.json({ access_token });
  } catch (err) {
    res.status(500).json({ message: "Failed to exchange public token", error: err });
  }
};

// 3. Get Transactions
export const getTransactions = async (req: Request, res: Response) => {
  const { access_token } = req.query;
  try {
    const response = await plaidClient.transactionsGet({
      access_token: access_token as string,
      start_date: "2023-01-01",
      end_date: "2025-01-01",
    });
    res.json(response.data.transactions);
  } catch (err) {
    res.status(500).json({ message: "Failed to get transactions", error: err });
  }
};
