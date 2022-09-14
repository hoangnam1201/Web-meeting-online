"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserReadDto = void 0;
class UserReadDto {
    static fromUser(user) {
        const userRead = new UserReadDto();
        userRead._id = user._id.toString();
        userRead.username = user.username;
        userRead.name = user.name;
        userRead.phone = user.phone;
        userRead.email = user.email;
        userRead.picture = user.picture;
        userRead.isVerify = user.isVerify;
        userRead.createdAt = user.createdAt;
        return userRead;
    }
    static fromArrayUser(users) {
        let usersReads = [];
        users.forEach((user) => {
            usersReads = [...usersReads, this.fromUser(user)];
        });
        return usersReads;
    }
}
exports.UserReadDto = UserReadDto;
//# sourceMappingURL=user-read.dto.js.map