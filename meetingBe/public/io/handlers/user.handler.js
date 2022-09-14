"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = (io) => {
    const connect = (socket) => {
        const userId = socket.data.userData.userId;
        socket.join(userId);
    };
    const disconnect = function () {
        const socket = this;
        // nothing
    };
    return {
        connect,
        disconnect
    };
};
//# sourceMappingURL=user.handler.js.map