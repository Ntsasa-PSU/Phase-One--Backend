/*
This Goals class manages financial goals in memory and saves them to a JSON file (for now).
Methods: add, get (by username), remove, and display all goals. 
The logic is separated from the storage layer, 
so we will be able to replace the JSON file operations (loadGoals, saveGoals) 
with database queries at a later time.

*/



import * as fs from "fs";
import * as path from "path";
import { v4 as uuidv4 } from "uuid";
import { Status } from "../Users/Users";

type Goal = {
    username: string;
    dateCreated: string;
    dateDue?: string;  // optional field
    topic: string;
    description: string;
    id: string;
};

export default class Goals {
    private filePath: string;
    private goals: Goal[] = [];

    /* constructor initializes the file path and loads existing goals */
    constructor(basePath: string) {
        this.filePath = path.join(basePath, "goals.json");
        this.loadGoals();
    }

    /* loads goals from the JSON file */
    private loadGoals() {
        try {
            if (fs.existsSync(this.filePath)) {
                const data = fs.readFileSync(this.filePath, "utf8");
                this.goals = JSON.parse(data);
            }
        } catch (error) {
            this.goals = [];
        }
    }

    /* saves goals to the JSON file */
    private saveGoals() {
        fs.writeFileSync(this.filePath, JSON.stringify(this.goals, null, 2), "utf8");
    }


    addGoal(goalData: Omit<Goal, "id" | "dateCreated">): Status {
        const newGoal: Goal = {
            ...goalData,
            id: uuidv4(),
            dateCreated: new Date().toISOString(),
        };
        this.goals.push(newGoal);
        this.saveGoals();
        return { return: 0, args: [newGoal.id], comments: "Goal added successfully" };
    }

    updateGoal(goalId: string, updatedData: Partial<Omit<Goal, "id" | "dateCreated">>): Status {
        const goalIndex = this.goals.findIndex(goal => goal.id === goalId);
        if (goalIndex === -1) {
            return { return: 1, args: [], comments: "Goal not found" };
        }
        this.goals[goalIndex] = {
            ...this.goals[goalIndex],
            ...updatedData,
            dateDue: updatedData.dateDue || this.goals[goalIndex].dateDue,
        };
        this.saveGoals();
        return { return: 0, args: [goalId], comments: "Goal updated successfully" };
    }

    getGoals(username: string): Goal[] {
        return this.goals.filter(goal => goal.username === username);
    }

    removeGoal(goalId: string): Status {
        const initialLength = this.goals.length;
        this.goals = this.goals.filter(goal => goal.id !== goalId);
        if (this.goals.length === initialLength) {
            return { return: 1, args: [], comments: "Goal not found" };
        }
        this.saveGoals();
        return { return: 0, args: [goalId], comments: "Goal removed successfully" };
    }

    displayAllGoals(): Goal[] {
        return this.goals;
    }
}
