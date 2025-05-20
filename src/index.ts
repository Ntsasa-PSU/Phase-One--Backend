import express from "express";
import dotenv from "dotenv";
import connectDB from "./config/db";

import userRoutes from "./routes/userRoutes"; 
import goalRoutes from "./routes/goalRoutes";
import transactionRoutes from "./routes/transactionRoutes";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

connectDB();

app.use(express.json());

// User routes
app.use("/api/users", userRoutes);

// Goals routes nested under users b/c goals will be user-specific
app.use("/api/users/:userId/goals", goalRoutes);

// Transaction routes
app.use("/api/transactions", transactionRoutes);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
