"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserCreateDto = void 0;
const crypto_js_1 = __importDefault(require("crypto-js"));
class UserCreateDto {
    static fromUser(user) {
        const userCreate = new UserCreateDto();
        userCreate.username = user.username;
        userCreate.name = user.name;
        userCreate.password = crypto_js_1.default.SHA256(user.password).toString();
        userCreate.phone = user.phone;
        userCreate.email = user.email;
        return userCreate;
    }
}
exports.UserCreateDto = UserCreateDto;
//# sourceMappingURL=user-create.dto.js.map