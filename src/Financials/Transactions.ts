import { Status } from "../Users/Users";
import * as fs from "fs";
import * as path from "path";
import { v4 as uuidv4 } from "uuid";

type Pre_Item = {
  name: string;
  price: number;
  currency: string;
};

type Item = {
  name: string;
  price: number;
  currency: string;
  id: number;
};

type Pre_Transaction = {
  From: string;
  Date: string;
  items: Item[];
};
type Transaction = {
  From: string;
  Date: string;
  items: Item[];
  id: number;
};

export default class Transactions {
  private filePath: string;
  private id: string;
  private transactions: Transaction[] = [];
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

    this.loadTransactions();
  }

  private loadTransactions() {
    try {
      const data = fs.readFileSync(this.filePath, "utf8");

      this.transactions = JSON.parse(data);
    } catch (error: any) {
      if (error.code === "ENOENT") {
        if (this.pre_create) {
          throw new Error("Yeah, not found,");
        }
      } else {
      }
    }
  }

  exportTransactions(): void {
    try {
      fs.mkdirSync(this.basePath, { recursive: true });

      fs.writeFileSync(
        this.filePath,
        JSON.stringify(this.transactions, null, 2),
        "utf8"
      );
    } catch (error) {}
  }

  importTransactions(newTransactions: Transaction[]): void {
    this.transactions = newTransactions;
  }

  getTransactionsBetweenDates(
    startDate: string,
    endDate: string
  ): Transaction[] {
    const start = new Date(startDate);
    const end = new Date(endDate);

    return this.transactions.filter((transaction) => {
      const transactionDate = new Date(transaction.Date);
      return transactionDate >= start && transactionDate <= end;
    });
  }

  getId(): string {
    return this.id;
  }

  /** ------------------------ */
  addTransaction(Data: Pre_Transaction): Status {
    let data: Status = {
      return: 1,
      args: [],
      comments: "",
    };

    return data;
  }

  addItem(Transaction_id: string, item: Pre_Item): Status {
    let data: Status = {
      return: 1,
      args: [],
      comments: "",
    };
    return data;
  }
  /** ------------------------ */
}
