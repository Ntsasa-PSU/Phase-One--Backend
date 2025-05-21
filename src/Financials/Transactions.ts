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
  // getting the total
  getTotalTransaction(currency?: string): number {
    return this.transactions.reduce((total, transaction) => {
      const transactionTotal = transaction.items.reduce((itemTotal, item) => {
        // checking if it is the same currency if not we skip over
        if (currency && item.currency !== currency) {
          return itemTotal; 
        }
        return itemTotal + item.price;
      }, 0);
      return total + transactionTotal;
    }, 0);
  }


  // would this be based on what the user has enetered in or would it be 
  addTransaction(Data: Pre_Transaction): Status {
    let data: Status = {
      return: 1,
      args: [],
      comments: "",
    };

    try {
      // we are getting the next
      const nextID = this.transactions.reduce(
        (maxId, tx) => Math.max(maxId, tx.id),
        0
      ) + 1;

      // we are building a new transaction
      const newTransaction: Transaction = {
        From: Data.From,
        Date: Data.Date,
        // map Pre_Item[] → Item[] (assigning IDs later if needed)
        items: Data.items.map((it, idx) => ({
          name: it.name,
          price: it.price,
          currency: it.currency,
          id: idx + 1,
        })),
        id: nextID,
      };

      // putting into memory
      this.transactions.push(newTransaction);

      // save
      this.exportTransactions();

      // checker
      data.return = 1;
      data.args = [nextID];
      data.comments = "This transaction was added successfully";
    } catch (error: any) {
      // in case we have a bad transaction that couldn't be added
      data.return = 0;
      data.comments =
        error.message || "This transaction FAILED to add";
    }
    return data;
  }

  addItem(Transaction_id: string, item: Pre_Item): Status {
    let data: Status = {
      return: 1,
      args: [],
      comments: "",
    };
    try {
      const transcId = Number(Transaction_id);

      // find the matching transaction
      const transactionFound = this.transactions.find(
        (tx) => tx.id === transcId
      );
      if (!transactionFound) {
        throw new Error("Transaction could not be found");
      }

      // determine next item ID
      const nextItemId =
        transactionFound.items.reduce(
          (max, it) => Math.max(max, it.id),
          0
        ) + 1;

      // build and add the new item
      const newItem: Item = {
        name: item.name,
        price: item.price,
        currency: item.currency,
        id: nextItemId,
      };
      transactionFound.items.push(newItem);

      // saving
      this.exportTransactions();

      // it works
      data.return = 1;
      data.args = [nextItemId];
      data.comments = "Item added successfully";
    } catch (error: any) {
      data.return = 0;
      data.comments = error.message || "Item FAILED to add";
    }
    return data;
  }
}