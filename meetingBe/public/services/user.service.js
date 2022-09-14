"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const user_model_1 = __importDefault(require("../models/user.model"));
const crypto_js_1 = __importDefault(require("crypto-js"));
exports.default = () => {
    const searchUser = (searchStr) => {
        searchStr = searchStr.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
        const regex = new RegExp(searchStr, "i");
        return user_model_1.default
            .find({
            $or: [{ username: { $regex: regex } }, { email: { $regex: regex } }],
        })
            .sort({ createdAt: 1 })
            .limit(6);
    };
    const findUserById = (id) => {
        return user_model_1.default.findById(id);
    };
    const findUserByEmail = (email) => {
        return user_model_1.default.findOne({ email: email });
    };
    const create = (userData) => {
        return user_model_1.default.create(userData);
    };
    const changeInfo = (id, userData) => {
        return user_model_1.default.findByIdAndUpdate(id, Object.assign({}, userData), { new: true });
    };
    const changePassword = (id, password) => {
        return user_model_1.default.findByIdAndUpdate(id, {
            password: crypto_js_1.default.SHA256(password).toString(),
        });
    };
    const getUsersByIds = (ids) => {
        return user_model_1.default.find({ _id: { $in: ids } });
    };
    const verifyEmail = (userId) => {
        return user_model_1.default.findOneAndUpdate({ _id: userId }, { isVerify: true });
    };
    return {
        verifyEmail,
        searchUser,
        findUserById,
        getUsersByIds,
        create,
        findUserByEmail,
        changeInfo,
        changePassword,
    };
};
//# sourceMappingURL=user.service.js.map