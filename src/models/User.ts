import mongoose, { Schema, Document } from "mongoose";
import { Transaction, TransactionSchema } from "./Transaction";
import { Goal, GoalSchema } from "./Goal";

export interface IUser extends Document {
  Username: string;
  email: string;
  hashed: string;
  salt: string;
  ref: string;
  Transactions_: Transaction[];
  Goals_: Goal[];
  plaidAccessToken?: string;
}

const UserSchema = new Schema<IUser>({
  Username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  hashed: { type: String, required: true },
  salt: { type: String, required: true },
  ref: { type: String, required: true, unique: true },
  Transactions_: { type: [TransactionSchema], default: [] },
  Goals_: { type: [GoalSchema], default: [] },
  plaidAccessToken: { type: String, required: false },
});

export default mongoose.model<IUser>("User", UserSchema);
