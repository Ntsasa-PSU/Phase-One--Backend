import { Status } from "../Users/Users";
import * as fs from "fs";
import * as path from "path";
import { v4 as uuidv4 } from "uuid";

//want to by in the future - no id yet
type Pre_Bill = {
    title: string;
    amount: number;
    currency: string;
};
//anything that has been used - has id
type Bill = {
    title: string;
    amount: number;
    currency: string;
    id: number;
};

export default class Bills {
    private filePath: string;
    private id: string;
    private bills: Bill[] = [];
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
        this.loadBills();
    }

    private loadBills() {
        try {
        const data = fs.readFileSync(this.filePath, "utf8");
        this.bills = JSON.parse(data);
        } catch (error: any) {
        if (error.code === "ENOENT") {
            if (this.pre_create) {
            throw new Error("Bill file not found");
            }
        } else{
        }
        }
    }

    exportBills(): void {
        try {
        fs.mkdirSync(this.basePath, { recursive: true });
        fs.writeFileSync(
            this.filePath,
            JSON.stringify(this.bills, null, 2),
            "utf8"
        );
        } catch (error) {
        // ignore write errors for now
        }
    }

    importBills(newBills: Bill[]): void {
        this.bills = newBills;
    }

    getId(): string {
        return this.id;
    }

    // Added total calculation method
    getTotalBillAmount(currency?: string): number {
        if (currency) {
        return this.bills
            .filter(bill => bill.currency === currency)
            .reduce((sum, bill) => sum + bill.amount, 0);
        }
        return this.bills.reduce((sum, bill) => sum + bill.amount, 0);
    }
    // adding bill 
    addBill(Data: Pre_Bill): Status {
        let data: Status = {
        return: 1,
        args: [],
        comments: "",
        };
        // figuring out what he next one is
        try {
        const nextID =
            this.bills.reduce((maxId, b) => Math.max(maxId, b.id), 0) + 1;

        const newBill: Bill = {
            title: Data.title,
            amount: Data.amount,
            currency: Data.currency,
            id: nextID,
        };

        this.bills.push(newBill);
        this.exportBills(); // constants update and saving them

        // it was success
        data.return = 1;
        data.args = [nextID];
        data.comments = "This bill was added successfully";
        } catch (error: any) {
        data.return = 0;
        data.comments = error.message || "This bill FAILED to add";
        }
        return data;
    }

}

