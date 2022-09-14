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
const room_create_dto_1 = require("../../Dtos/room-create.dto");
const room_detail_dto_1 = require("../../Dtos/room-detail.dto");
const room_read_dto_1 = require("../../Dtos/room-read.dto");
const mail_service_1 = __importDefault(require("../../services/mail.service"));
const notification_service_1 = __importDefault(require("../../services/notification.service"));
const room_service_1 = __importDefault(require("../../services/room.service"));
const user_service_1 = __importDefault(require("../../services/user.service"));
exports.default = () => {
    const roomService = (0, room_service_1.default)();
    const mailService = (0, mail_service_1.default)();
    const userService = (0, user_service_1.default)();
    const notificationService = (0, notification_service_1.default)();
    const createRoom = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const errors = (0, express_validator_1.validationResult)(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ status: 400, errors: errors.array() });
        }
        const userId = req.userData.userId;
        const room = Object.assign(Object.assign({}, req.body), { owner: userId });
        const roomCreate = room_create_dto_1.RoomCreateDto.fromRoom(room);
        try {
            yield roomService.create(roomCreate);
            return res.status(200).json({ status: 200, data: null });
        }
        catch (err) {
            return res.status(500).json({
                status: 500,
                msg: "Internal Server Error",
            });
        }
    });
    const deleteRoom = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const roomId = req.params.roomId;
        try {
            yield roomService.deleteRoom(roomId);
            return res.status(200).json({ status: 200, data: null });
        }
        catch (err) {
            return res.status(500).json({
                status: 500,
                msg: "Internal Server Error",
            });
        }
    });
    const changeRoom = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const roomId = req.params.roomId;
        const room = req.body;
        const roomChange = room_create_dto_1.RoomCreateDto.fromRoom(room);
        try {
            yield roomService.changeRoomInfo(roomId, roomChange);
            return res.status(200).json({ status: 200, data: null });
        }
        catch (err) {
            return res
                .status(500)
                .json({ status: 500, error: "Internal Server Error" });
        }
    });
    const increaseFloors = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const roomId = req.params.roomId;
        try {
            yield roomService.inscreaseFloors(roomId);
            return res.status(200).json({ status: 200, data: null });
        }
        catch (err) {
            console.log(err);
            return res
                .status(500)
                .json({ status: 500, error: "Internal Server Error" });
        }
    });
    const deleteFloor = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const roomId = req.params.roomId;
        const { floor } = req.query;
        try {
            yield roomService.deleteFloor(roomId, floor.toString());
            return res.status(200).json({ status: 200, data: null });
        }
        catch (err) {
            console.log(err);
            return res
                .status(500)
                .json({ status: 500, error: "Internal Server Error" });
        }
    });
    const getRoomById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const roomId = req.params.roomId;
        try {
            const room = yield roomService.getDetail(roomId);
            if (!room)
                return res.status(400).json({ status: 400, msg: "Not Found" });
            const roomDetail = room_detail_dto_1.RoomReadDetailDto.fromRoom(room);
            return res.status(200).json({ status: 200, data: roomDetail });
        }
        catch (err) {
            console.log(err);
            return res
                .status(500)
                .json({ status: 500, error: "Internal Server Error" });
        }
    });
    const getOwnedRoom = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const userId = req.userData.userId;
        try {
            const { pageIndex, pageSize } = req.query;
            if (!pageIndex && !pageSize) {
                const rooms = yield roomService.getOwnedRooms(userId);
                const roomReads = room_read_dto_1.RoomReadDto.fromArray(rooms);
                return res.status(200).json({ status: 200, data: roomReads });
            }
            const index = parseInt(pageIndex, 10) || 0;
            const take = parseInt(pageSize, 10) || 10;
            const roomData = yield roomService.getPageDataOwnedRooms(userId, take, index);
            return res.status(200).json({
                status: 200,
                data: {
                    count: roomData[0].count,
                    results: room_read_dto_1.RoomReadDto.fromArray(roomData[0].results),
                },
            });
        }
        catch (err) {
            return res
                .status(500)
                .json({ status: 500, msg: "Internal Server Error" });
        }
    });
    const getInvitedRoom = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const userId = req.userData.userId;
        try {
            const { pageIndex, pageSize } = req.query;
            if (!pageIndex && !pageSize) {
                const rooms = yield roomService.getInvitedRoom(userId);
                const roomReads = room_read_dto_1.RoomReadDto.fromArray(rooms);
                return res.status(200).json({ status: 200, data: roomReads });
            }
            const index = parseInt(pageIndex, 10) || 0;
            const take = parseInt(pageSize, 10) || 10;
            const roomData = yield roomService.getPageDataInvitedRooms(userId, take, index);
            return res.status(200).json({
                status: 200,
                data: roomData,
            });
        }
        catch (err) {
            return res
                .status(500)
                .json({ status: 500, error: "Internal Server Error" });
        }
    });
    const addMember = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const roomId = req.params.roomId;
        const userId = req.body.userId;
        const authId = req.userData.userId;
        try {
            yield roomService.addMember(userId, roomId);
            const notification = yield notificationService.createType12N(userId, notificationService.Type.receiptInvitation, authId, roomId);
            const user = yield userService.findUserById(userId);
            if (!user)
                return res.status(400).json({ status: 400, error: "Not Found" });
            yield mailService.sendInvitation(roomId, user.email);
            req.app.io.to(userId).emit("notification", notification);
            res.status(200).json({ status: 200, data: null });
        }
        catch (err) {
            return res
                .status(500)
                .json({ status: 500, error: "Internal Server Error" });
        }
    });
    const addMembers = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const roomId = req.params.roomId;
        const userIds = req.body.userIds;
        const authId = req.userData.userId;
        try {
            yield roomService.addMembers(userIds, roomId);
            const users = yield userService.getUsersByIds(userIds);
            const ids = users.reduce((total, currentUser) => {
                return total + " " + currentUser.email;
            }, "");
            yield mailService.sendInvitation(roomId, ids);
            yield Promise.all(userIds.map((id) => __awaiter(void 0, void 0, void 0, function* () {
                const notification = yield notificationService.createType12N(id, notificationService.Type.receiptInvitation, authId, roomId);
                req.app.io.to(id).emit("notification", notification);
            })));
            res.status(200).json({ status: 200, data: null });
        }
        catch (err) {
            return res
                .status(500)
                .json({ status: 500, error: "Internal Server Error" });
        }
    });
    const removeMembers = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const roomId = req.params.roomId;
        const userIds = req.body.userIds;
        const authId = req.userData.userId;
        try {
            yield roomService.removeMembers(userIds, roomId);
            const users = yield userService.getUsersByIds(userIds);
            const ids = users.reduce((total, currentUser) => {
                return total + " " + currentUser.email;
            }, "");
            yield mailService.sendExpulsion(roomId, ids);
            yield Promise.all(userIds.map((id) => __awaiter(void 0, void 0, void 0, function* () {
                const notification = yield notificationService.createType12N(id, notificationService.Type.isRemoved, authId, roomId);
                req.app.io.to(id).emit("notification", notification);
            })));
            return res.status(200).json({ status: 200, data: null });
        }
        catch (err) {
            return res
                .status(500)
                .json({ status: 500, error: "Internal Server Error" });
        }
    });
    const removeMember = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const roomId = req.params.roomId;
        const userId = req.query.userId;
        const authId = req.userData.userId;
        try {
            yield roomService.removeMember(userId, roomId);
            const notification = yield notificationService.createType12N(userId, notificationService.Type.isRemoved, authId, roomId);
            const user = yield userService.findUserById(userId);
            if (!user)
                return res.status(400).json({ status: 400, error: "Not Found" });
            yield mailService.sendExpulsion(roomId, user.email);
            req.app.io.to(userId).emit("notification", notification);
            return res.status(200).json({ status: 200, data: null });
        }
        catch (err) {
            console.log(err);
            return res
                .status(500)
                .json({ status: 500, error: "Internal Server Error" });
        }
    });
    return {
        increaseFloors,
        removeMember,
        removeMembers,
        addMember,
        addMembers,
        createRoom,
        changeRoom,
        getInvitedRoom,
        getOwnedRoom,
        getRoomById,
        deleteRoom,
        deleteFloor,
    };
};
//# sourceMappingURL=room.controller.js.map