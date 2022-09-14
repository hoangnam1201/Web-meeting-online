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
const table_read_dto_1 = require("../../Dtos/table-read.dto");
const message_read_dto_1 = require("../../Dtos/message-read.dto");
const room_detail_dto_1 = require("../../Dtos/room-detail.dto");
const user_read_dto_1 = require("../../Dtos/user-read.dto");
const user_service_1 = __importDefault(require("../../services/user.service"));
const file_service_1 = __importDefault(require("../../services/file.service"));
const message_service_1 = __importDefault(require("../../services/message.service"));
const room_service_1 = __importDefault(require("../../services/room.service"));
const table_service_1 = __importDefault(require("../../services/table.service"));
exports.default = (ioRoom, io) => {
    const userService = (0, user_service_1.default)();
    const fileService = (0, file_service_1.default)();
    const roomService = (0, room_service_1.default)();
    const tableService = (0, table_service_1.default)();
    const messageService = (0, message_service_1.default)();
    const joinRoom = function (roomId) {
        return __awaiter(this, void 0, void 0, function* () {
            const socket = this;
            const userId = socket.data.userData.userId;
            try {
                const check = yield roomService.checkCanAccept(roomId, userId);
                // is class member
                if (check) {
                    socket.join(roomId);
                    socket.data.roomId = roomId;
                    const room = yield roomService.findOneAndAddJoiner(roomId, userId);
                    if (!room)
                        return socket.emit("error:bad-request", "not found room");
                    socket.emit("room:info", room_detail_dto_1.RoomReadDetailDto.fromRoom(room));
                    ioRoom
                        .to(roomId)
                        .emit("room:user-joined", user_read_dto_1.UserReadDto.fromArrayUser(room.joiners));
                    //join first floor
                    let tables = [];
                    if (room.floors.length > 0) {
                        tables = yield tableService.getTablesByRoomAndFloor(roomId, room.floors[0]);
                        socket.emit("floor:tables", {
                            tables: table_read_dto_1.TableReadDto.fromArray(tables),
                            floor: room.floors[0],
                        });
                        socket.join(room.floors[0].toString());
                        socket.data.floor = room.floors[0].toString();
                    }
                    if (room.isPresent)
                        ioRoom.to(roomId).emit("room:present", { time: 1, tables });
                    const messages = yield messageService.getMessages(roomId, 30, 0);
                    socket.emit("room:messages", message_read_dto_1.MessageReadDto.fromArray(messages));
                    return;
                }
                //not a class member
                socket.emit("room:join-err", {
                    msg: "You are not a class member, Please wait for the room owner to accept",
                    type: "REQUEST",
                });
                const user = yield userService.findUserById(userId);
                const room = yield roomService.findById(roomId);
                if (user)
                    ioRoom.to(room.owner.toString()).emit("room:user-request", {
                        user: user_read_dto_1.UserReadDto.fromUser(user),
                        socketId: socket.id,
                    });
            }
            catch (err) {
                socket.emit("room:err", { err });
            }
        });
    };
    const acceptRequest = function (socketId, userId, accept) {
        return __awaiter(this, void 0, void 0, function* () {
            const socket = this;
            const roomId = socket.data.roomId;
            const clientSocket = ioRoom.sockets.get(socketId);
            if (!accept)
                return ioRoom.to(socketId).emit("room:join-err", {
                    msg: "Your request has been declined",
                    type: "REFUSE",
                });
            try {
                const room = yield roomService.findOneAndAddJoiner(roomId, userId);
                if (!room)
                    return socket.emit("error:bad-request", "not found room");
                clientSocket.join(roomId);
                clientSocket.data.roomId = roomId;
                ioRoom.to(socketId).emit("room:info", room_detail_dto_1.RoomReadDetailDto.fromRoom(room));
                ioRoom
                    .to(roomId)
                    .emit("room:user-joined", user_read_dto_1.UserReadDto.fromArrayUser(room.joiners));
                //join first floor
                let tables = [];
                if (room.floors.length > 0) {
                    tables = yield tableService.getTablesByRoomAndFloor(roomId, room.floors[0]);
                    clientSocket.emit("floor:tables", {
                        tables: table_read_dto_1.TableReadDto.fromArray(tables),
                        floor: room.floors[0],
                    });
                    clientSocket.join(room.floors[0].toString());
                    clientSocket.data.floor = room.floors[0].toString();
                }
                if (room.isPresent)
                    ioRoom.to(roomId).emit("room:present", { time: 1, tables });
                const messages = yield messageService.getMessages(roomId, 20, 0);
                ioRoom
                    .to(socketId)
                    .emit("room:messages", message_read_dto_1.MessageReadDto.fromArray(messages));
            }
            catch (err) {
                console.log(err);
                socket.emit("room:err", "Internal Server Error");
            }
        });
    };
    const leaveRoom = function () {
        return __awaiter(this, void 0, void 0, function* () {
            const socket = this;
            const roomId = socket.data.roomId;
            const userId = socket.data.userData.userId;
            const peerId = socket.data.peerId;
            const floor = socket.data.floor;
            try {
                const room = yield roomService.findOneAndRemoveJoiner(roomId, userId);
                if (!room)
                    return socket.emit("room:bad-request", "not found room");
                ioRoom.to(roomId).emit("room:user-joined", room.joiners);
                const tableId = socket.data.tableId;
                if (tableId) {
                    yield tableService.removeJoiner(tableId, userId);
                    const tables = yield tableService.getTablesByRoomAndFloor(roomId, floor);
                    socket
                        .in(roomId)
                        .to(floor)
                        .emit("floor:tables", {
                        tables: table_read_dto_1.TableReadDto.fromArray(tables),
                        floor,
                    });
                    ioRoom.to(tableId).emit("table:user-leave", { userId, peerId });
                }
                //stop presenting if user is owner
                if (room.isPresent === false)
                    return;
                if (room.owner.toString() === userId.toString()) {
                    const roomInfo = yield roomService.findOneAndUpdatePresent(roomId, false);
                    ioRoom
                        .to(roomId)
                        .emit("room:info", room_detail_dto_1.RoomReadDetailDto.fromRoom(roomInfo));
                    ioRoom.to(roomId).emit("present:close");
                }
                ioRoom.to(roomId).emit("present:user-leave", { userId, peerId });
            }
            catch (err) {
                socket.emit("room:err", err);
            }
        });
    };
    const sendMessage = function (data, callBack) {
        return __awaiter(this, void 0, void 0, function* () {
            const socket = this;
            const userId = socket.data.userData.userId;
            const roomId = socket.data.roomId;
            try {
                const files = yield Promise.all(data.files.map((f) => __awaiter(this, void 0, void 0, function* () {
                    const id = yield fileService.putFile(f.name, f.data);
                    return { fileId: id.toString(), name: f.name };
                })));
                const message = yield messageService.create(userId, roomId, data.msgString, files);
                ioRoom
                    .to(roomId)
                    .emit("room:message", message_read_dto_1.MessageReadDto.fromMessage(message));
                callBack && callBack("success");
            }
            catch (_a) {
                callBack && callBack("error to send message");
            }
        });
    };
    const sendTableMessage = function (data) {
        return __awaiter(this, void 0, void 0, function* () {
            const socket = this;
            const userId = socket.data.userData.userId;
            const tableId = socket.data.tableId;
            const sender = yield userService.findUserById(userId);
            const message = {
                sender: user_read_dto_1.UserReadDto.fromUser(sender),
                files: data.files,
                message: data.msgString,
                createAt: new Date(),
            };
            ioRoom.to(tableId).emit("table:message", message);
        });
    };
    const getMessages = function (pageIndex = 0) {
        return __awaiter(this, void 0, void 0, function* () {
            const socket = this;
            const roomId = socket.data.roomId;
            const messages = yield messageService.getMessages(roomId, 20, pageIndex * 20);
            socket.emit("room:messages", message_read_dto_1.MessageReadDto.fromArray(messages));
        });
    };
    const joinTable = function (tableId, peerId, media) {
        return __awaiter(this, void 0, void 0, function* () {
            const socket = this;
            const userId = socket.data.userData.userId;
            const roomId = socket.data.roomId;
            const floor = socket.data.floor;
            try {
                //check full table
                const table = yield tableService.getById(tableId);
                if (table.numberOfSeat <= table.users.length) {
                    socket.emit("table:join-err", "the table is full");
                    return;
                }
                // check previous tables
                const tableIdTemp = socket.data.tableId;
                if (tableIdTemp) {
                    socket.leave(tableIdTemp);
                    yield tableService.removeJoiner(tableIdTemp, userId);
                    ioRoom.to(tableIdTemp).emit("table:user-leave", { userId, peerId });
                }
                //join new table
                yield tableService.addJoiner(roomId, tableId, userId);
                const tables = yield tableService.getTablesByRoomAndFloor(roomId, floor);
                ioRoom.to(floor).emit("floor:tables", {
                    tables: table_read_dto_1.TableReadDto.fromArray(tables),
                    floor,
                });
                const user = yield userService.findUserById(userId);
                ioRoom.to(tableId).emit("table:user-joined", {
                    user: user_read_dto_1.UserReadDto.fromUser(user),
                    peerId,
                    media,
                });
                socket.join(tableId);
                socket.data.tableId = tableId;
                socket.data.peerId = peerId;
                socket.emit("table:join-success", tableId);
            }
            catch (err) {
                socket.emit("table:err", err);
            }
        });
    };
    const joinPreviousTable = function (peerId, media) {
        return __awaiter(this, void 0, void 0, function* () {
            const socket = this;
            const userId = socket.data.userData.userId;
            const roomId = socket.data.roomId;
            const floor = socket.data.floor;
            const tableId = socket.data.tableId;
            try {
                //check full table
                const table = yield tableService.getById(tableId);
                if (table.numberOfSeat <= table.users.length) {
                    socket.emit("table:join-err", "the table is full");
                    return;
                }
                //join new table
                yield tableService.addJoiner(roomId, tableId, userId);
                const tables = yield tableService.getTablesByRoomAndFloor(roomId, floor);
                ioRoom.to(floor).emit("floor:tables", {
                    tables: table_read_dto_1.TableReadDto.fromArray(tables),
                    floor,
                });
                const user = yield userService.findUserById(userId);
                ioRoom.to(tableId).emit("table:user-joined", {
                    user: user_read_dto_1.UserReadDto.fromUser(user),
                    peerId,
                    media,
                });
                socket.join(tableId);
                socket.data.tableId = tableId;
                socket.data.peerId = peerId;
                socket.emit("table:join-success", tableId);
            }
            catch (err) {
                socket.emit("table:err", err);
            }
        });
    };
    const joinFloor = function (floor) {
        return __awaiter(this, void 0, void 0, function* () {
            const socket = this;
            const roomId = socket.data.roomId;
            const previousFloor = socket.data.floor;
            socket.leave(previousFloor);
            const tables = yield tableService.getTablesByRoomAndFloor(roomId, floor);
            socket.emit("floor:tables", {
                tables: table_read_dto_1.TableReadDto.fromArray(tables),
                floor,
            });
            //save new floor
            socket.data.floor = floor;
            socket.join(floor);
        });
    };
    const changeMedia = function (media, type) {
        return __awaiter(this, void 0, void 0, function* () {
            const socket = this;
            const tableId = socket.data.tableId;
            const userId = socket.data.userData.userId;
            const peerId = socket.data.peerId;
            const roomId = socket.data.roomId;
            if (type.toLowerCase() === "present") {
                ioRoom
                    .to(roomId)
                    .emit("present:media", { peerId: peerId, userId: userId, media });
                return;
            }
            ioRoom
                .to(tableId)
                .emit("table:media", { peerId: peerId, userId: userId, media });
        });
    };
    const present = function (time) {
        return __awaiter(this, void 0, void 0, function* () {
            const socket = this;
            const roomId = socket.data.roomId;
            const userId = socket.data.userData.userId;
            if (!roomId)
                return;
            try {
                const checkRoom = yield roomService.findById(roomId);
                if (checkRoom.owner.toString() !== userId.toString())
                    return socket.emit("room:err", "You do not have permission to present");
                const room = yield roomService.findOneAndUpdatePresent(roomId, true);
                yield tableService.findAndClearJoiner(roomId);
                ioRoom.to(roomId).emit("room:present", { time, tables: [] });
                setTimeout(() => {
                    ioRoom.to(roomId).emit("room:info", room_detail_dto_1.RoomReadDetailDto.fromRoom(room));
                }, 1000 * time);
            }
            catch (err) {
                console.log(err);
                return socket.emit("room:err", "Internal Server Error");
            }
        });
    };
    const joinPresent = function (peerId, media) {
        return __awaiter(this, void 0, void 0, function* () {
            const socket = this;
            const roomId = socket.data.roomId;
            const userId = socket.data.userData.userId;
            socket.data.peerId = peerId;
            try {
                const tableIdTemp = socket.data.tableId;
                if (tableIdTemp) {
                    socket.leave(tableIdTemp);
                }
                const room = yield roomService.findById(roomId);
                if (room.isPresent !== true)
                    return;
                const user = yield userService.findUserById(userId);
                ioRoom.to(roomId).emit("present:user-joined", {
                    user: user_read_dto_1.UserReadDto.fromUser(user),
                    peerId,
                    media,
                });
            }
            catch (err) {
                return socket.emit("room:err", "Internal Server Error");
            }
        });
    };
    const stopPresenting = function () {
        return __awaiter(this, void 0, void 0, function* () {
            const socket = this;
            const roomId = socket.data.roomId;
            const userId = socket.data.userData.userId;
            try {
                const room = yield roomService.findById(roomId);
                if (room.isPresent === false)
                    return;
                if (room.owner.toString() !== userId.toString())
                    return socket.emit("room:err", "You do not have permission to present");
                //close presenting
                const roomInfo = yield roomService.findOneAndUpdatePresent(roomId, false);
                ioRoom.to(roomId).emit("room:info", room_detail_dto_1.RoomReadDetailDto.fromRoom(roomInfo));
                ioRoom.to(roomId).emit("present:close");
            }
            catch (err) {
                return socket.emit("room:err", "Internal Server Error");
            }
        });
    };
    const leaveTable = function name(peerId) {
        return __awaiter(this, void 0, void 0, function* () {
            const socket = this;
            const userId = socket.data.userData.userId;
            const roomId = socket.data.roomId;
            const floor = socket.data.floor;
            try {
                const tableIdTemp = socket.data.tableId;
                if (tableIdTemp) {
                    socket.leave(tableIdTemp);
                    yield tableService.removeJoiner(tableIdTemp, userId);
                    ioRoom.to(tableIdTemp).emit("table:user-leave", { userId, peerId });
                    const tables = yield tableService.getTablesByRoomAndFloor(roomId, floor);
                    ioRoom.to(floor).emit("floor:tables", {
                        tables: table_read_dto_1.TableReadDto.fromArray(tables),
                        floor,
                    });
                }
            }
            catch (err) {
                socket.emit("table:err", err);
            }
        });
    };
    const pin = function name() {
        return __awaiter(this, void 0, void 0, function* () {
            const socket = this;
            const userId = socket.data.userData.userId;
            const roomId = socket.data.roomId;
            const peerId = socket.data.peerId;
            ioRoom.to(roomId).emit("present:pin", { userId, peerId });
        });
    };
    const divideTables = function () {
        return __awaiter(this, void 0, void 0, function* () {
            const socket = this;
            const roomId = socket.data.roomId;
            try {
                const tables = yield tableService.findAndClearJoiner(roomId);
                ioRoom
                    .to(roomId)
                    .emit("room:divide-tables", table_read_dto_1.TableReadDto.fromArray(tables));
            }
            catch (_a) {
                return socket.emit("room:err", "Internal Server Error");
            }
        });
    };
    return {
        joinRoom,
        joinFloor,
        leaveRoom,
        leaveTable,
        sendMessage,
        present,
        getMessages,
        sendTableMessage,
        joinTable,
        joinPreviousTable,
        joinPresent,
        stopPresenting,
        changeMedia,
        acceptRequest,
        pin,
        divideTables,
    };
};
//# sourceMappingURL=room.handler.js.map