import Incomes from "./Incomes";
import { Status } from "../Users/Users";
import path from "path";
import * as fs from "fs";

export default class AllIncomes {
    Incomes_all: Incomes[];
    Id_incomes: { [Id: string]: Incomes };
    Path: string;

    constructor(Path: string) {
        this.Path = path.join(Path, "Incomes");
        this.Id_incomes = {};
        this.Incomes_all = [];
        this.loads();
    }
    
    //making sure the directory exist for the bills that are being created
    async loads() {
        try {
        if (!fs.existsSync(this.Path)) {
            fs.mkdirSync(this.Path, { recursive: true });
        }
        } catch (error) {
        }
    }

    getIncomes(Id: string): Incomes | null {
        if (this.Id_incomes[Id]) {
        return this.Id_incomes[Id];
        }
        let load: Incomes | null;
        try {
        load = new Incomes(this.Path, Id);
        } catch (error) {
        load = null;
        }
        if (load) {
        this.Id_incomes[Id] = load;
        this.Incomes_all.push(load);
        }
        return load;
    }

    // calling the the getotal for all the incomes(for stock, more than one job and more)
    getTotalIncome(currency?: string): number {
        return this.Incomes_all.reduce((total, income) => {
        return total + income.getTotalIncomeAmount(currency);
        }, 0);
    }


    //creating incomes and giving an ID
    createIncomes(): Incomes {
        const newIncome = new Incomes(this.Path);
        this.Id_incomes[newIncome.getId()] = newIncome;
        this.Incomes_all.push(newIncome);
        return newIncome;
    }

    // could export each Incomes in Incomes_all
    export() {
        this.Incomes_all.forEach(incomes =>{
            incomes.exportIncomes();
        });
    }
}
