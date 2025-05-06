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

  addTransaction(data: Transac_info): Status {
    let datas: Status = {
      return: 1,
      args: [],
      comments: "",
    };

    return datas;
  }

  removeTransactions(Id: string): Status {
    let data: Status = {
      return: 1,
      args: [],
      comments: "",
    };

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
