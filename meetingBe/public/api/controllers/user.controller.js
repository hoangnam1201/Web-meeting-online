"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_validator_1 = require("express-validator");
const user_read_dto_1 = require("../../Dtos/user-read.dto");
const user_create_dto_1 = require("../../Dtos/user-create.dto");
const user_change_dto_1 = __importDefault(require("../../Dtos/user-change.dto"));
const user_service_1 = __importDefault(require("../../services/user.service"));
exports.default = () => {
    const userService = (0, user_service_1.default)();
    const searchUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        let searchValue = req.query.searchValue || "";
        try {
            const users = yield userService.searchUser(searchValue);
            return res.status(200).json({ status: 200, data: users });
        }
        catch (_a) {
            return res
                .status(500)
                .json({ status: 500, data: null, error: "Internal Server Errror" });
        }
    });
    const findUserById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const userId = req.query.userId;
        try {
            const user = yield userService.findUserById(userId);
            return res
                .status(200)
                .json({ status: 200, data: user_read_dto_1.UserReadDto.fromUser(user) });
        }
        catch (_b) {
            return res
                .status(500)
                .json({ status: 500, data: null, error: "Internal Server Errror" });
        }
    });
    const register = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const errors = (0, express_validator_1.validationResult)(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ status: 400, errors: errors.array() });
        }
        const userCreate = user_create_dto_1.UserCreateDto.fromUser(req.body);
        try {
            yield userService.create(userCreate);
            return res.status(200).json({ status: 200, data: null });
        }
        catch (err) {
            console.log(err);
            return res
                .status(500)
                .json({ status: 500, data: null, error: "Internal Server Errror" });
        }
    });
    const getDetail = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const userId = req.userData.userId;
        try {
            const user = yield userService.findUserById(userId);
            const userRead = user_read_dto_1.UserReadDto.fromUser(user);
            return res.status(200).json({ status: 200, data: userRead });
        }
        catch (err) {
            return res
                .status(500)
                .json({ status: 500, data: null, error: "Internal Server Errror" });
        }
    });
    const changeInfor = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const errors = (0, express_validator_1.validationResult)(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ status: 400, errors: errors.array() });
        }
        const userId = req.userData.userId;
        const userChange = user_change_dto_1.default.fromUser(req.body);
        try {
            const user = yield userService.changeInfo(userId, userChange);
            return res.status(200).json({ status: 200, data: user });
        }
        catch (err) {
            return res
                .status(500)
                .json({ status: 500, data: null, error: "Internal Server Errror" });
        }
    });
    const changePassword = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const errors = (0, express_validator_1.validationResult)(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ status: 400, errors: errors.array() });
        }
        const userId = req.userData.userId;
        const password = req.body.password;
        try {
            const user = yield userService.changePassword(userId, password);
            return res.status(200).json({ status: 200, data: user });
        }
        catch (err) {
            return res
                .status(500)
                .json({ status: 500, data: null, error: "Internal Server Errror" });
        }
    });
    return {
        searchUser,
        findUserById,
        register,
        getDetail,
        changeInfor,
        changePassword,
    };
};
//# sourceMappingURL=user.controller.js.map