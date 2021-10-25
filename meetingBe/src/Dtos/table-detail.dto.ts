import { UserReadDto } from "./user-read.dto";
import { Table } from "../models/table.model";
import { User } from "../models/user.model";
import { UserReadCallDto } from "./user-read-call.dto";

export class TableDetailDto {
    _id: any;
    name: string;
    users: UserReadCallDto[];
    numberOfSeat: number

    static fromTable(table: Table): TableDetailDto {
        const tableDetail = new TableDetailDto();
        tableDetail._id = table._id;
        tableDetail.name = table.name;
        tableDetail.numberOfSeat = table.numberOfSeat;
        tableDetail.users = UserReadCallDto.fromArrayUser(table.users as User[]);
        return tableDetail;
    }

    static fromArray(tables: Table[]): TableDetailDto[] {
        return tables.map(table=> this.fromTable(table));
    }
}