"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.initIOServer = void 0;
const user_handler_1 = __importDefault(require("./handlers/user.handler"));
const auth_middleware_1 = __importDefault(require("./middlewares/auth.middleware"));
const room_namespace_1 = __importDefault(require("./namespaces/room.namespace"));
const notification_handler_1 = __importDefault(require("./handlers/notification.handler"));
const initIOServer = (io) => {
    io.use(auth_middleware_1.default.verifyToken);
    const _userHandler = (0, user_handler_1.default)(io);
    const _notifyHandler = (0, notification_handler_1.default)(io);
    (0, room_namespace_1.default)(io);
    // tableNamespace(io);
    io.on('connection', (socket) => {
        _userHandler.connect(socket);
        _notifyHandler.getNotification(socket);
        socket.on('disconnect', _userHandler.disconnect);
    });
};
exports.initIOServer = initIOServer;
//# sourceMappingURL=index.js.map