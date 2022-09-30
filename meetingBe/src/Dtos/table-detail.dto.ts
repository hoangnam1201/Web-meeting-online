import { UserReadDetailDto } from "./user-read-detail.dto";
import { Table } from "../models/table.model";
import { User } from "../models/user.model";
import { UserReadCallDto } from "./user-read-call.dto";

export class TableDetailDto {
  _id: any;
  name: string;
  users: UserReadCallDto[];
  members: UserReadDetailDto[];
  numberOfSeat: number;
  floor: string;

  static fromTable(table: Table): TableDetailDto {
    const tableDetail = new TableDetailDto();
    tableDetail._id = table._id;
    tableDetail.name = table.name;
    tableDetail.numberOfSeat = table.numberOfSeat;
    tableDetail.users = UserReadCallDto.fromArrayUser(table.users as User[]);
    tableDetail.members = UserReadDetailDto.fromArrayUser(table.members as User[]);
    tableDetail.floor = table.floor.toString();
    return tableDetail;
  }

  static fromArray(tables: Table[]): TableDetailDto[] {
    return tables.map((table) => this.fromTable(table));
  }
}
