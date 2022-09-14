"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserReadCallDto = void 0;
class UserReadCallDto {
    static fromUser(user) {
        const userRead = new UserReadCallDto();
        userRead._id = user._id.toString();
        userRead.username = user.username;
        userRead.name = user.name;
        return userRead;
    }
    static fromArrayUser(users) {
        return users.map(user => this.fromUser(user));
    }
}
exports.UserReadCallDto = UserReadCallDto;
//# sourceMappingURL=user-read-call.dto.js.map