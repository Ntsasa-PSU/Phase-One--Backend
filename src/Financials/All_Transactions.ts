import Transactions from "./Transactions";
import { Status } from "../Users/Users";
import path from "path";
import * as fs from "fs";
export default class AllTransactions {
  Transactions_all: Transactions[];
  Id_transactions: { [Id: string]: Transactions };
  Path: string;
  constructor(Path: string) {
    this.Path = path.join(Path, "Transactions");
    this.Id_transactions = {};
    this.Transactions_all = [];
    this.loads();
  }

  async loads() {
    try {
      if (!fs.existsSync(this.Path)) {
        fs.mkdirSync(this.Path, { recursive: true });
      }
    } catch (error) {}
  }

  getTransaction(Id: string): Transactions | null {
    if (this.Id_transactions[Id]) {
      return this.Id_transactions[Id];
    }
    let load: Transactions | null;
    try {
      load = new Transactions(this.Path, Id);
    } catch (error) {
      load = null;
    }
    if (load) {
      this.Id_transactions[Id] = load;
      this.Transactions_all.push(load);
    }
    return load;
  }

  /** ------------------------ */
  createTransaction(): Transactions | null {
    return null;
  }

  export() {}
  /** ------------------------ */
}
