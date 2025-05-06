import User from "./User";
import { normalize } from "path";
import { readFile, writeFile } from "fs/promises";
import * as fs from "fs";
type Users_ = {
  Users: User[];
  Users_loc: User_Stats[];
};

type Pre_User_Stats = {
  Username: String;
  email: string;
  password: string;
};

type User_Stats = {
  Username: string;
  email: string;
  hashed: string;
  salt: string;
  id: string;
  ref: string;
};

type Login = {
  UsernameEmail: string;
  Password: string;
};

type Status = {
  return: number;
  args: any[];
  comments: string;
};

export default class Users {
  Users_system: User_Stats[];
  Users_data: User[];
  Users_username: { [Username: string]: User };
  Users_email: { [Email: string]: User };
  Users_id: { [Id: string]: User };
  Users_ref: { [Ref: string]: User };
  Path: string;

  constructor(Path?: string) {
    this.Users_system = [];
    this.Users_data = [];
    this.Users_username = {};
    this.Users_email = {};
    this.Users_id = {};
    this.Users_ref = {};

    if (Path == null) {
      Path = "./Users";
      this.Path = Path;
    } else {
      Path = normalize(Path + "/Users");
      this.Path = normalize(Path);
    }
    this.import(Path);
    this.setup();
  }

  async import(Path: string): Promise<Boolean> {
    try {
      this.Users_system = await JSON.parse(await readFile(Path, "utf-8"));
      return true;
    } catch (error) {
      return false;
    }
  }

  async setup(): Promise<boolean> {
    try {
      if (!fs.existsSync(this.Path)) {
        fs.mkdirSync(this.Path, { recursive: true });
      }
    } catch (error) {}

    let temp_store: User;

    this.Users_system.map((data: User_Stats, value: number): void => {
      temp_store = new User(this.Path, data);
      this.Users_data.push(temp_store);
      this.Users_username[data.Username] = temp_store;
      this.Users_email[data.email] = temp_store;
      this.Users_id[data.id] = temp_store;
      this.Users_ref[data.ref] = temp_store;
    });

    return true;
  }

  getUserByRef(ref: string): User | undefined {
    return this.Users_ref[ref];
  }

  async save(): Promise<boolean> {
    try {
      await writeFile(
        normalize(this.Path + "/Users.json"),
        JSON.stringify(this.Users_system, null, 2),
        "utf-8"
      );

      for (const user of this.Users_data) {
        await user.export();
      }

      return true;
    } catch (error) {
      return false;
    }
  }

  /** ------------------------ */

  async signUp(Data: Pre_User_Stats): Promise<Status> {
    let data: Status = {
      return: 1,
      args: [],
      comments: "",
    };

    return data;
  }

  async login(login: Login): Promise<Status> {
    let data: Status = {
      return: 1,
      args: [],
      comments: "",
    };

    return data;
  }
  /** ------------------------ */
}

export { User_Stats, Status };
