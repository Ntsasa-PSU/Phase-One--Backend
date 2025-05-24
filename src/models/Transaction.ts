import { Schema } from "mongoose";

export type Transaction = {
  Name: string;
  Id: string;
};

export const TransactionSchema = new Schema<Transaction>(
  {
    Name: { type: String, required: true },
    Id: { type: String, required: true },
  },
  { _id: false }
);
