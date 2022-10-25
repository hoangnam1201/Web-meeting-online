import { ObjectId } from "mongoose";
import { Table } from "../models/table.model";

export class TableUpdateDto {
  room: ObjectId;
  name: string;
  numberOfSeat: number;
  floor: ObjectId;

  static fromTable(table: Table) {
    const tableCreate = new TableUpdateDto();
    tableCreate.name = table.name;
    tableCreate.numberOfSeat = table.numberOfSeat;
    tableCreate.room = table.room;
    tableCreate.floor = table.floor;
    return tableCreate;
  }
}
