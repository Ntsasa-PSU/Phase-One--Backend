import { Status } from "../Users/Users";
import * as fs from "fs";
import * as path from "path";
import { v4 as uuidv4 } from "uuid";

type Pre_Income = {
    source: string;
    amount: number;
    currency: string;
    };

    type Income = {
    source: string;
    amount: number;
    currency: string;
    id: number;
    };

    export default class Incomes {
    private filePath: string;
    private id: string;
    private incomes: Income[] = [];
    private basePath: string;
    private pre_create: boolean;

    constructor(basePath: string, id?: string) {
        this.basePath = basePath;

        if (id) {
        this.id = id;
        this.pre_create = true;
        } else {
        this.pre_create = false;
        this.id = uuidv4();
        }

        this.filePath = path.join(this.basePath, `${this.id}.json`);
        this.loadIncomes();
    }

    private loadIncomes() {
        try {
        const data = fs.readFileSync(this.filePath, "utf8");
        this.incomes = JSON.parse(data);
        } catch (error: any) {
        if (error.code === "ENOENT") {
            if (this.pre_create) {
            throw new Error("Income file not found");
            }
        }else{
        }
        }
    }

    exportIncomes(): void {
        try {
        fs.mkdirSync(this.basePath, { recursive: true });
        fs.writeFileSync(
            this.filePath,
            JSON.stringify(this.incomes, null, 2),
            "utf8"
        );
        } catch (error) {
        }
    }

    importIncomes(newIncomes: Income[]): void {
        this.incomes = newIncomes;
    }

    getId(): string {
        return this.id;
    }

    // total income
    getTotalIncomeAmount(currency?: string): number {
        if (currency) {
            return this.incomes
        .filter(income => income.currency === currency)
        .reduce((sum, income) => sum + income.amount, 0);
        }
        return this.incomes.reduce((sum, income) => sum + income.amount, 0);
    }

    addIncome(Data: Pre_Income): Status {
        let data: Status = {
        return: 1,
        args: [],
        comments: "",
        };

        try {
        const nextID =
            this.incomes.reduce((maxId, inc) => Math.max(maxId, inc.id), 0) + 1;

        const newIncome: Income = {
            source: Data.source,
            amount: Data.amount,
            currency: Data.currency,
            id: nextID,
        };

        this.incomes.push(newIncome);
        this.exportIncomes();

        //success
        data.return = 1;
        data.args = [nextID];
        data.comments = "This income was added successfully";
        } catch (error: any) {
        data.return = 0;
        data.comments = error.message || "This income FAILED to add";
        }
        return data;
    }
}
