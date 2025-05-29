import express from "express";
import * as GoalsController from "../controllers/goalsController";
import { authenticateFirebase } from "../middleware/auth";

const router = express.Router({ mergeParams: true });

router.post("/", authenticateFirebase, GoalsController.addGoal);
router.get("/", authenticateFirebase, GoalsController.getGoals);
router.get("/:goalId", authenticateFirebase, GoalsController.getGoal);
router.put("/:goalId", authenticateFirebase, GoalsController.updateGoal);
router.delete("/:goalId", authenticateFirebase, GoalsController.deleteGoal);

export default router;
