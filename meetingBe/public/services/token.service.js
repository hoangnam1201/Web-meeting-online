"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const token_model_1 = __importDefault(require("../models/token.model"));
exports.default = () => {
    const getByToken = (token) => {
        return token_model_1.default.findOne({ token: token });
    };
    const remove = (token) => {
        return token_model_1.default.deleteOne({ token: token });
    };
    const create = (token, userId) => {
        return token_model_1.default.create({ token, userId });
    };
    return { getByToken, remove, create };
};
//# sourceMappingURL=token.service.js.map