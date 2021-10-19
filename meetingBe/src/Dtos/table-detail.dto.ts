import { UserReadDto } from "./user-read.dto";
import { Table } from "../models/table.model";
import { User } from "../models/user.model";

export class TableDetailDto {
    _id: any;
    name: string;
    users: UserReadDto[];
    numberOfSeat: number

    static fromTable(table: Table): TableDetailDto {
        const tableDetail = new TableDetailDto();
        tableDetail._id = table._id;
        tableDetail.name = table.name;
        tableDetail.numberOfSeat = table.numberOfSeat;
        tableDetail.users = (table.users as User[]).map((user: User) => {
            return UserReadDto.fromUser(user);
        })
        return tableDetail;
    }

    static fromArray(tables: Table[]): TableDetailDto[] {
        return tables.map(table=> this.fromTable(table));
    }
}