import { Table } from "../models/table.model";
import { User } from "../models/user.model";
import { UserReadDetailDto } from "./user-read-detail.dto";

export class TableReadCSVDto {
  _id: any;
  name: string;
  members: UserReadDetailDto[];

  static fromTable(
    table: Table,
    preR: number
  ): {
    data: TableReadCSVDto;
    p: { s: { r: number; c: number }; e: { r: number; c: number } };
  } {
    const tableDetail = new TableReadCSVDto();
    tableDetail.name = table.name;
    tableDetail.members = UserReadDetailDto.fromArrayUser(
      table.members as User[]
    );
    const length = tableDetail.members.length;
    return {
      data: tableDetail,
      p: {
        s: { r: preR + 1, c: 0 },
        e: {
          r: preR + (length === 0 ? 1 : length),
          c: 0,
        },
      },
    };
  }

  static fromArray(tables: Table[]): {
    data: any[];
    merges: { s: { r: number; c: number }; e: { r: number; c: number } }[];
  } {
    let currentR = 0;
    let merges: any[] = [];
    // let data: any[] = [];
    const data = tables.reduce((list, table: Table) => {
      const result = this.fromTable(table, currentR);
      currentR = result.p.e.r;
      if (result.p.e.r !== result.p.s.r) merges = [...merges, result.p];
      const members = result.data.members.map((u) => ({
        group_table: result.data.name,
        id: u._id,
        name: u.name,
        email: u.email,
      }));
      list.push(...members);
      return list;
    }, []);
    return { data: data, merges };
  }
}
