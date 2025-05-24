import express from "express";
import * as GoalsController from "../controllers/goalsController";

const router = express.Router({ mergeParams: true });

router.post("/", GoalsController.addGoal);
router.get("/", GoalsController.getGoals);
router.get("/:goalId", GoalsController.getGoal);
router.put("/:goalId", GoalsController.updateGoal);
router.delete("/:goalId", GoalsController.deleteGoal);

export default router;
