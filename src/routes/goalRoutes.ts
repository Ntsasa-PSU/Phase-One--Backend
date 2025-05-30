import express from "express";
import * as GoalsController from "../controllers/goalsController";
import { authenticateJWT } from "../middleware/auth";

const router = express.Router({ mergeParams: true });

router.post("/", authenticateJWT, GoalsController.addGoal);
router.get("/", authenticateJWT, GoalsController.getGoals);
router.get("/:goalId", authenticateJWT, GoalsController.getGoal);
router.put("/:goalId", authenticateJWT, GoalsController.updateGoal);
router.delete("/:goalId", authenticateJWT, GoalsController.deleteGoal);

export default router;
