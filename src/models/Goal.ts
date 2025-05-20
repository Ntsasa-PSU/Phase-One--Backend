import { Schema } from "mongoose";

export type Goal = {
  toObject(): Goal;
  Id: string;
  Title: string;
  Description?: string;
  TargetAmount?: number;
  CurrentAmount?: number;
  Deadline?: Date;
};

export const GoalSchema = new Schema<Goal>(
  {
    Id: { type: String, required: true },
    Title: { type: String, required: true },
    Description: { type: String },
    TargetAmount: { type: Number },
    CurrentAmount: { type: Number, default: 0 },
    Deadline: { type: Date },
  },
  { _id: false }
);
