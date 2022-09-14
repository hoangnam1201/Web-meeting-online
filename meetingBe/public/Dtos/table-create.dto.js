"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TableCreateDto = void 0;
class TableCreateDto {
    static fromTable(table) {
        const tableCreate = new TableCreateDto();
        tableCreate.name = table.name;
        tableCreate.numberOfSeat = table.numberOfSeat;
        tableCreate.room = table.room;
        tableCreate.floor = table.floor;
        return tableCreate;
    }
}
exports.TableCreateDto = TableCreateDto;
//# sourceMappingURL=table-create.dto.js.map