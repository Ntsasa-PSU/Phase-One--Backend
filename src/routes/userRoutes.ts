import express from "express";
import { signup, login, getCurrentUser } from "../controllers/userController"; 
import { authenticateJWT } from "../middleware/auth";

const router = express.Router();

// Signup route
router.post("/signup", signup);

// Login route
router.post("/login", login);

//User info route for FE, current need is to get ref for user to use Plaid
router.get("/me", authenticateJWT, getCurrentUser);


export default router;
