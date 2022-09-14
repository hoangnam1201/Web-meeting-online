"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TableReadDto = void 0;
const user_read_dto_1 = require("./user-read.dto");
class TableReadDto {
    static fromTable(table) {
        const tableDetail = new TableReadDto();
        tableDetail._id = table._id;
        tableDetail.name = table.name;
        tableDetail.numberOfSeat = table.numberOfSeat;
        tableDetail.users = user_read_dto_1.UserReadDto.fromArrayUser(table.users);
        return tableDetail;
    }
    static fromArray(tables) {
        return tables.map(table => this.fromTable(table));
    }
}
exports.TableReadDto = TableReadDto;
//# sourceMappingURL=table-read.dto.js.map