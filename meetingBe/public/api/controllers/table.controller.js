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
const table_create_dto_1 = require("../../Dtos/table-create.dto");
const table_service_1 = __importDefault(require("../../services/table.service"));
exports.default = () => {
    const tableService = (0, table_service_1.default)();
    const createTable = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const errors = (0, express_validator_1.validationResult)(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ status: 400, errors: errors.array() });
        }
        try {
            const tableCreate = table_create_dto_1.TableCreateDto.fromTable(req.body);
            yield tableService.create(tableCreate);
            return res.status(200).json({ status: 200, data: null });
        }
        catch (_a) {
            return res
                .status(500)
                .json({ status: 500, msg: "Enternal Server Error" });
        }
    });
    const saveMember = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const { roomId } = req.params;
        try {
            yield tableService.saveMember(roomId);
            return res.status(200).json({ status: 200, data: null });
        }
        catch (_b) {
            return res
                .status(500)
                .json({ status: 500, msg: "Internal Server Error" });
        }
    });
    const deleteTable = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const tableId = req.params.tableId;
        try {
            yield tableService.removeTable(tableId);
            return res.status(200).json({ status: 200, data: null });
        }
        catch (_c) {
            return res
                .status(500)
                .json({ status: 500, msg: "Internal Server Error" });
        }
    });
    const addUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const tableId = req.params.tableId;
        const userId = req.body.userId;
        try {
            yield tableService.addUser(tableId, userId);
            return res.status(200).json({ status: 200, data: null });
        }
        catch (_d) {
            return res
                .status(500)
                .json({ status: 500, msg: "Internal Server Error" });
        }
    });
    const removeUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const tableId = req.params.tableId;
        const userId = req.body.userId;
        try {
            yield tableService.removeUser(tableId, userId);
            return res.status(200).json({ status: 200, data: null });
        }
        catch (_e) {
            return res
                .status(500)
                .json({ status: 500, msg: "Internal Server Error" });
        }
    });
    const getTable = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const tableId = req.params.tableId;
        try {
            const table = tableService.getDetail(tableId);
            return res.status(200).json({ status: 200, data: table });
        }
        catch (_f) {
            return res
                .status(500)
                .json({ status: 500, msg: "Internal Server Error" });
        }
    });
    const getTablesInRoom = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const roomId = req.params.roomId;
        try {
            const tables = yield tableService.getTablesInRoom(roomId);
            return res.status(200).json({ status: 200, data: tables });
        }
        catch (_g) {
            return res
                .status(500)
                .json({ status: 500, msg: "Internal Server Error" });
        }
    });
    const getTablesInRoomAndFloor = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const roomId = req.params.roomId;
        const floor = req.query.floor;
        try {
            const tables = yield tableService.getTablesByRoomAndFloor(roomId, floor.toString());
            return res.status(200).json({ status: 200, data: tables });
        }
        catch (_h) {
            return res
                .status(500)
                .json({ status: 500, msg: "Internal Server Error" });
        }
    });
    const searchMember = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const roomId = req.params.roomId;
        try {
            const items = yield tableService.searchMember(roomId);
            res.status(200).json({ data: items[0] ? items[0].members : [] });
        }
        catch (_j) { }
    });
    const getMemberTables = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const roomId = req.params.roomId;
        const { limit = "10", page = "0" } = req.query;
        const ltemp = parseInt(limit);
        const ptemp = parseInt(page);
        try {
            const items = yield tableService.getMemberTables(roomId, ltemp, ptemp);
            res.status(200).json({ data: items[0], status: 200 });
        }
        catch (_k) {
            res.status(500).json({ error: "Interal Server Error", status: 200 });
        }
    });
    return {
        createTable,
        saveMember,
        deleteTable,
        getMemberTables,
        searchMember,
        removeUser,
        addUser,
        getTable,
        getTablesInRoom,
        getTablesInRoomAndFloor,
    };
};
//# sourceMappingURL=table.controller.js.map