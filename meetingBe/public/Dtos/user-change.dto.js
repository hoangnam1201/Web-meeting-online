"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class UserChangeDto {
    static fromUser(user) {
        const userChange = new UserChangeDto();
        userChange.name = user.name;
        userChange.phone = user.phone;
        return userChange;
    }
}
exports.default = UserChangeDto;
//# sourceMappingURL=user-change.dto.js.map