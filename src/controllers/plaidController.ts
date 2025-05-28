import { Request, Response } from "express";
import { plaidClient } from "../config/plaid";
import { Products, CountryCode } from "plaid";
import User, { IUser } from "../models/User";
import { AuthenticatedRequest } from "../middleware/auth";

// 1. Create Link Token
export const createLinkToken = async (req: AuthenticatedRequest, res: Response) => {
  const { userRef } = req.body;

  if (!userRef) {
    res.status(400).json({ message: "Missing userRef" });
    return;
  }

  try {
    const user: IUser | null = await User.findOne({ ref: userRef });

    if (!user) {
      res.status(404).json({ message: "User not found" });
      return;
    }

    const clientUserId = user._id.toString();

    const response = await plaidClient.linkTokenCreate({
      user: { client_user_id: clientUserId },
      client_name: "Finance App",
      products: [Products.Transactions],
      country_codes: [CountryCode.Us],
      language: "en",
    });

    res.json({ link_token: response.data.link_token });
    return;
  } catch (err) {
    console.error("Link token error:", err);
    res.status(500).json({ message: "Failed to create link token", error: err });
    return;
  }
};

// 2. Exchange Public Token for a permanent access_token for user 
export const exchangePublicToken = async (req: AuthenticatedRequest, res: Response) => {
  if (!req.user) {
    res.status(401).json({ message: "Unauthorized" });
    return;
  }

  const { public_token } = req.body;
  if (!public_token) {
    res.status(400).json({ message: "Missing public_token" });
    return;
  }

  try {
    const response = await plaidClient.itemPublicTokenExchange({ public_token });
    const access_token = response.data.access_token;

    await User.findByIdAndUpdate(req.user.userId, { $set: { plaidAccessToken: access_token } });

    res.json({ access_token });
    return;
  } catch (err) {
    console.error("Exchange public token error:", err);
    res.status(500).json({ message: "Failed to exchange public token", error: err });
    return;
  }
};

// 3. Get Transactions
export const getTransactions = async (req: AuthenticatedRequest, res: Response) => {
  if (!req.user) {
    res.status(401).json({ message: "Unauthorized" });
    return;
  }

  try {
    const user: IUser | null = await User.findById(req.user.userId);
    if (!user || !user.plaidAccessToken) {
      res.status(404).json({ message: "User or access token not found" });
      return;
    }

    const response = await plaidClient.transactionsGet({
      access_token: user.plaidAccessToken,
      start_date: "2023-01-01",
      end_date: "2025-01-01",
    });

    res.json(response.data.transactions);
    return;
  } catch (err) {
    console.error("Get transactions error:", err);
    res.status(500).json({ message: "Failed to get transactions", error: err });
    return;
  }
};
