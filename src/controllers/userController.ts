import { Request, Response } from "express";
import User from "../models/User";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

// Signup controller
export const signup = async (req: Request, res: Response): Promise<void> => {
  try {
    const { Username, email, password } = req.body;

    if (!Username || !email || !password) {
      res.status(400).json({ message: "Please provide all required fields" });
      return;
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      res.status(409).json({ message: "User with this email already exists" });
      return;
    }

    const salt = await bcrypt.genSalt(10);
    const hashed = await bcrypt.hash(password, salt);
    const ref = `ref_${Date.now()}_${Math.floor(Math.random() * 10000)}`;

    const newUser = new User({
      Username,
      email,
      hashed,
      salt,
      ref,
      Transactions_: [],
      Goals_: [],
    });

    await newUser.save();

    // Generate JWT right after signup
    const token = jwt.sign(
      { userId: newUser._id, email: newUser.email },
      process.env.JWT_SECRET || "your_jwt_secret",
      { expiresIn: "2h" }
    );

    res.status(201).json({
      message: "User registered successfully",
      token,
      userId: newUser._id
    });
  } catch (error) {
    console.error("Signup error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Login controller
export const login = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      res.status(400).json({ message: "Please provide email and password" });
      return;
    }

    const user = await User.findOne({ email });
    if (!user) {
      res.status(401).json({ message: "Invalid credentials" });
      return;
    }

    // Compare password hash
    const isMatch = await bcrypt.compare(password, user.hashed);
    if (!isMatch) {
      res.status(401).json({ message: "Invalid credentials" });
      return;
    }

    // Generate JWT token (replace 'your_jwt_secret' with your secret key)
    const token = jwt.sign(
      { userId: user._id, email: user.email },
      process.env.JWT_SECRET || "your_jwt_secret",
      { expiresIn: "2h" }
    );

    res.status(200).json({ message: "Login successful", token, userId: user._id });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
