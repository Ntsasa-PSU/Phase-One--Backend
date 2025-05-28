import { Response } from "express";
import User, { IUser } from "../models/User";
import { Transaction } from "../models/Transaction";
import { AuthenticatedRequest } from "../middleware/auth";

// Add a transaction to a user's Transactions_ array
export const addTransaction = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  const { transaction } = req.body as { transaction: Transaction };
  const userId = req.user?.userId;

  if (!userId) {
    res.status(401).json({ message: "Unauthorized" });
    return;
  }
  if (!transaction) {
    res.status(400).json({ message: "Missing transaction data" });
    return;
  }

  try {
    const user: IUser | null = await User.findById(userId);
    if (!user) {
      res.status(404).json({ message: "User not found" });
      return;
    }

    user.Transactions_.push(transaction);
    await user.save();

    res.status(201).json({ message: "Transaction added", transaction });
  } catch (error) {
    res.status(500).json({ message: "Error adding transaction", error });
  }
};

// Remove a transaction from a user's Transactions_ array
export const removeTransaction = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  const { transactionId } = req.body as { transactionId: string };
  const userId = req.user?.userId;

  if (!userId) {
    res.status(401).json({ message: "Unauthorized" });
    return;
  }
  if (!transactionId) {
    res.status(400).json({ message: "Missing transactionId" });
    return;
  }

  try {
    const user: IUser | null = await User.findById(userId);
    if (!user) {
      res.status(404).json({ message: "User not found" });
      return;
    }

    const originalLength = user.Transactions_.length;
    user.Transactions_ = user.Transactions_.filter((t) => t.Id !== transactionId);

    if (user.Transactions_.length === originalLength) {
      res.status(404).json({ message: "Transaction not found" });
      return;
    }

    await user.save();

    res.status(200).json({ message: "Transaction removed" });
  } catch (error) {
    res.status(500).json({ message: "Error removing transaction", error });
  }
};

// Get all transactions for the authenticated user
export const getTransactions = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  const userId = req.user?.userId;

  if (!userId) {
    res.status(401).json({ message: "Unauthorized" });
    return;
  }

  try {
    const user: IUser | null = await User.findById(userId);
    if (!user) {
      res.status(404).json({ message: "User not found" });
      return;
    }

    res.status(200).json(user.Transactions_);
  } catch (error) {
    res.status(500).json({ message: "Error fetching transactions", error });
  }
};
