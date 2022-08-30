import { Table } from "../models/table.model";
import { User } from "../models/user.model";
import { UserReadDto } from "./user-read.dto";

export class TableReadDto {
    _id: any;
    name: string;
    users: UserReadDto[];
    numberOfSeat: number

    static fromTable(table: Table): TableReadDto {
        const tableDetail = new TableReadDto();
        tableDetail._id = table._id;
        tableDetail.name = table.name;
        tableDetail.numberOfSeat = table.numberOfSeat;
        tableDetail.users = UserReadDto.fromArrayUser(table.users as User[]);
        return tableDetail;
    }

    static fromArray(tables: Table[]): TableReadDto[] {
        return tables.map(table => this.fromTable(table));
    }
}