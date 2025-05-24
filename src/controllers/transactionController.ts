import { Request, Response } from "express";
import User, { IUser } from "../models/User";
import { Transaction } from "../models/Transaction";

// Add a transaction to a user's Transactions_ array
export const addTransaction = async (req: Request, res: Response): Promise<void> => {
  const { userRef, transaction } = req.body as { userRef: string; transaction: Transaction };

  if (!userRef || !transaction) {
    res.status(400).json({ message: "Missing userRef or transaction data" });
    return;
  }

  try {
    const user: IUser | null = await User.findOne({ ref: userRef });
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
export const removeTransaction = async (req: Request, res: Response): Promise<void> => {
  const { userRef, transactionId } = req.body as { userRef: string; transactionId: string };

  if (!userRef || !transactionId) {
    res.status(400).json({ message: "Missing userRef or transactionId" });
    return;
  }

  try {
    const user: IUser | null = await User.findOne({ ref: userRef });
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

// Get all transactions for a user by userRef (from URL param)
export const getTransactions = async (req: Request, res: Response): Promise<void> => {
  const { userRef } = req.params;

  try {
    const user: IUser | null = await User.findOne({ ref: userRef });
    if (!user) {
      res.status(404).json({ message: "User not found" });
      return;
    }

    res.status(200).json(user.Transactions_);
  } catch (error) {
    res.status(500).json({ message: "Error fetching transactions", error });
  }
};
