"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const room_handler_1 = __importDefault(require("../handlers/room.handler"));
const auth_middleware_1 = __importDefault(require("../middlewares/auth.middleware"));
exports.default = (io) => {
    const roomNamespace = io.of("/socket/rooms");
    const _roomHandler = (0, room_handler_1.default)(roomNamespace, io);
    roomNamespace.use(auth_middleware_1.default.verifyToken);
    const connection = (socket) => {
        const userId = socket.data.userData.userId;
        socket.join(userId);
        socket.on("floor:join", _roomHandler.joinFloor);
        socket.on("room:join", _roomHandler.joinRoom);
        socket.on("room:get-messages", _roomHandler.getMessages);
        socket.on("room:send-message", _roomHandler.sendMessage);
        socket.on("room:present", _roomHandler.present);
        socket.on("room:access-request", _roomHandler.acceptRequest);
        socket.on("room:divide-tables", _roomHandler.divideTables);
        socket.on("table:join", _roomHandler.joinTable);
        socket.on("table:join-previous", _roomHandler.joinPreviousTable);
        socket.on("table:send-message", _roomHandler.sendTableMessage);
        socket.on("change-media", _roomHandler.changeMedia);
        socket.on("disconnecting", _roomHandler.leaveRoom);
        socket.on("present:join", _roomHandler.joinPresent);
        socket.on("present:stop", _roomHandler.stopPresenting);
        socket.on("table:leave", _roomHandler.leaveTable);
        socket.on("present:pin", _roomHandler.pin);
    };
    roomNamespace.on("connection", connection);
};
//# sourceMappingURL=room.namespace.js.map