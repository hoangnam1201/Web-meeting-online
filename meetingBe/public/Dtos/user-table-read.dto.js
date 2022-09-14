"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserTableReadDto = void 0;
const user_read_call_dto_1 = require("./user-read-call.dto");
class UserTableReadDto {
    static fromUserTable(userTable) {
        const userRead = new UserTableReadDto();
        userRead.user = user_read_call_dto_1.UserReadCallDto.fromUser(userTable.user);
        userRead.video = userTable.video;
        userRead.audio = userTable.audio;
        userRead.peerId = userTable.peerId;
        return userRead;
    }
    static fromArray(userTables) {
        return userTables.map((userTable) => this.fromUserTable(userTable));
    }
}
exports.UserTableReadDto = UserTableReadDto;
//# sourceMappingURL=user-table-read.dto.js.map