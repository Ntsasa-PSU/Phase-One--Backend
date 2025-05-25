import { v4 as uuidv4 } from "uuid";
import { Request, Response } from "express";
import User from "../models/User";

// Add a new goal for a user

export const addGoal = async (req: Request, res: Response) => {
  const { userId } = req.params;
  const newGoal = req.body;

  try {
    const user = await User.findById(userId);
    if (!user) {
      res.status(404).json({ message: "User not found" });
      return;
    }

    if (!newGoal.Id) {
      newGoal.Id = uuidv4(); // Auto-assign a unique string ID
    }

    user.Goals_.push(newGoal);
    await user.save();

    res.status(201).json({ message: "Goal added", goal: newGoal });
  } catch (error) {
    console.error("Add goal error:", error);
    res.status(500).json({ message: "Error adding goal", error });
  }
};


// Get all goals for a user
export const getGoals = async (req: Request, res: Response) => {
  const { userId } = req.params;

  try {
    const user = await User.findById(userId);
    if (!user) {
      res.status(404).json({ message: "User not found" });
      return;
    }

    res.status(200).json(user.Goals_);
  } catch (error) {
    res.status(500).json({ message: "Error fetching goals", error });
  }
};

// Get a specific goal by goalId for a user
export const getGoal = async (req: Request, res: Response) => {
  const { userId, goalId } = req.params;

  try {
    const user = await User.findById(userId);
    if (!user) {
      res.status(404).json({ message: "User not found" });
      return;
    }

    const goal = user.Goals_.find((goal) => goal.Id === goalId);
    if (!goal) {
      res.status(404).json({ message: "Goal not found" });
      return;
    }

    res.status(200).json(goal);
  } catch (error) {
    res.status(500).json({ message: "Error fetching goal", error });
  }
};

// Update a goal by goalId for a user
export const updateGoal = async (req: Request, res: Response) => {
  const { userId, goalId } = req.params;
  const updates = req.body;

  try {
    const user = await User.findById(userId);
    if (!user) {
      res.status(404).json({ message: "User not found" });
      return;
    }

    const goalIndex = user.Goals_.findIndex((goal) => goal.Id === goalId);
    if (goalIndex === -1) {
      res.status(404).json({ message: "Goal not found" });
      return;
    }

    // Update the goal properties
    user.Goals_[goalIndex] = { ...user.Goals_[goalIndex].toObject(), ...updates };
    await user.save();

    res.status(200).json({ message: "Goal updated", goal: user.Goals_[goalIndex] });
  } catch (error) {
    res.status(500).json({ message: "Error updating goal", error });
  }
};

// Delete a goal by goalId for a user
export const deleteGoal = async (req: Request, res: Response) => {
  const { userId, goalId } = req.params;

  try {
    const user = await User.findById(userId);
    if (!user) {
      res.status(404).json({ message: "User not found" });
      return;
    }

    const originalLength = user.Goals_.length;
    user.Goals_ = user.Goals_.filter((goal) => goal.Id !== goalId);

    if (user.Goals_.length === originalLength) {
      res.status(404).json({ message: "Goal not found" });
      return;
    }

    await user.save();

    res.status(200).json({ message: "Goal deleted" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting goal", error });
  }
};
