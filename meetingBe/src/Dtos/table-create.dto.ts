import { ObjectId } from "mongoose";
import { Table } from "../models/table.model";

export class TableCreateDto {
    room: ObjectId;
    name: string;
    numberOfSeat: number

    static fromTable(table: Table) {
        const tableCreate = new TableCreateDto();
        tableCreate.name = table.name;
        tableCreate.numberOfSeat = table.numberOfSeat;
        tableCreate.room = table.room;
        return tableCreate;
    }
}