import { User_Stats } from "./Users";
import { normalize } from "path";
import { readFile, writeFile, mkdir } from "fs/promises";
import { existsSync } from "fs";
import { Status } from "./Users";
type User_Finances = {
  Transactions_: Transac_info[];
};

type Transac_info = {
  Name: String;
  Id: String;
};

export default class User {
  Path: string;
  Username: string;
  email: string;
  hashed: string;
  salt: string;
  id: string;
  ref: string;
  data: User_Finances;
  private userDataFilePath: string;
  constructor(Path: string, reference: User_Stats) {
    this.Path = normalize(Path);
    this.Username = reference.Username;
    this.email = reference.email;
    this.hashed = reference.hashed;
    this.salt = reference.salt;
    this.id = reference.id;
    this.ref = reference.ref;
    this.data = {
      Transactions_: [],
    };

    this.userDataFilePath = normalize(this.Path + "/" + this.id + ".json");

    this.import();
  }

  async import(): Promise<boolean> {
    try {
      if (existsSync(this.userDataFilePath)) {
        const dataString = await readFile(this.userDataFilePath, "utf-8");
        this.data = JSON.parse(dataString);
      } else {
        this.data = { Transactions_: [] };
      }
      return true;
    } catch (error) {
      return false;
    }
  }

  async export(): Promise<boolean> {
    try {
      await writeFile(
        this.userDataFilePath,
        JSON.stringify(this.data, null, 2),
        "utf-8"
      );
      return true;
    } catch (error) {
      return false;
    }
  }

  /** ------------------------ */

  async addTransaction(data: Transac_info): Promise<Status> {
    let datas: Status = {
      return: 1,
      args: [],
      comments: "",
    };
    try {
      this.data.Transactions_.push(data);
      const exportResult = await this.export();
      if (exportResult) {
        datas.return = 0;
        datas.args = [data];
        datas.comments = "Transaction added successfully";
      } else {
        datas.return = 1;
        datas.comments = "Failed to export data";
      }
    } catch  {
      datas.return = 1;
      datas.comments = `Failed to add transaction: `;
    }
    return datas;
  }

  async removeTransactions(Id: string): Promise<Status> {
    let data: Status = {
      return: 1,
      args: [],
      comments: "",
    };
    try{
      const initialLength = this.data.Transactions_.length;
      this.data.Transactions_ = this.data.Transactions_.filter(
        (transaction) => transaction.Id !== Id
      );

     if(this.data.Transactions_.length === initialLength)
      {
        data.comments = "Transaction not found";
        data.return = 1;
        return data;
    }
    const exportResult = await this.export();
    if (exportResult) {
      data.return = 0;
      data.args = [Id];
      data.comments = "Transaction removed successfully";
    }
    else {
      data.return = 1;
      data.comments = "Failed to export data";
    }
    } catch (error) {
      data.return = 1;
      data.comments = `Failed to remove transaction: `;
    }

    return data;
  }

  /** ------------------------ */

  getTransactions(): Status {
    let data: Status = {
      return: 1,
      args: [this.data.Transactions_],
      comments: "All the transactions",
    };
    return data;
  }
}
