import { ObjectId } from "mongoose";
import { Table } from "../models/table.model";

export class TableCreateDto {
  room: ObjectId;
  name: string;
  numberOfSeat: number;
  floor: ObjectId;

  static fromTable(table: Table) {
    const tableCreate = new TableCreateDto();
    tableCreate.name = table.name;
    tableCreate.numberOfSeat = table.numberOfSeat;
    tableCreate.room = table.room;
    tableCreate.floor = table.floor;
    return tableCreate;
  }

  static fromArray(tables: Table[]) {
    return tables.map((t) => this.fromTable(t));
  }
}
