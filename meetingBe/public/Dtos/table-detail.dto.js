"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TableDetailDto = void 0;
const user_read_call_dto_1 = require("./user-read-call.dto");
class TableDetailDto {
    static fromTable(table) {
        const tableDetail = new TableDetailDto();
        tableDetail._id = table._id;
        tableDetail.name = table.name;
        tableDetail.numberOfSeat = table.numberOfSeat;
        tableDetail.users = user_read_call_dto_1.UserReadCallDto.fromArrayUser(table.users);
        return tableDetail;
    }
    static fromArray(tables) {
        return tables.map(table => this.fromTable(table));
    }
}
exports.TableDetailDto = TableDetailDto;
//# sourceMappingURL=table-detail.dto.js.map