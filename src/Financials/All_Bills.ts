import Bills from "./Bills";
import { Status } from "../Users/Users";
import path from "path";
import * as fs from "fs";

export default class AllBills{
    Bills_all: Bills[];
    Id_bills: { [Id: string]: Bills };
    Path: string;

    constructor(Path: string) {
        this.Path = path.join(Path, "Bills");
        this.Id_bills = {}; 
        this.Bills_all = [];
        this.loads();
    }
    //making sure the directory exist for the bills that are being created
    async loads(){
        try{
            if(!fs.existsSync(this.Path)){
            fs.mkdirSync(this.Path, {recursive: true});
            }
            // failed
        } catch(error){} 
    }
    //using the id to retrieve the bills
    Get_Bills(Id: string): Bills | null {
        if(this.Id_bills[Id]) {
            return this.Id_bills[Id];
        }
        let load: Bills | null;
        try {
            load = new Bills(this.Path, Id);
        } catch(error) {
            load = null;
        }
        if(load){
            this.Id_bills[Id] = load;
            this.Bills_all.push(load);
        }
        return load;
    }
    // start from 0 all the way to the end all bills
    getTotalBill(currency?: string): number {
        return this.Bills_all.reduce((total, bill) => {
        return total + bill.getTotalBillAmount(currency);
        }, 0);
    }
    //can create new bill  and giving an ID
    create_Bills(): Bills {
        const newBill = new Bills(this.Path);
        this.Id_bills[newBill.getId()] = newBill;
        this.Bills_all.push(newBill);
        return newBill;
    }
    //can make a load to constantly loop through and export each
    export(){
        this.Bills_all.forEach(bills =>{
            bills.exportBills();
        });
    }
}