import { Socket } from "socket.io";
import roomHandler from '../handlers/room.handler';
import AuthMiddlesware from "../middlewares/auth.middleware";

export default (io: any) => {
    const roomNamespace = io.of('/socket/rooms');

    const _roomHandler = roomHandler(roomNamespace, io);

    roomNamespace.use(AuthMiddlesware.verifyToken);

    const connection = (socket: Socket) => {
        const userId = socket.data.userData.userId;
        socket.join(userId);
        socket.on('room:join', _roomHandler.joinRoom);
        socket.on('room:send-message', _roomHandler.sendMessage);
        socket.on('room:get-messages', _roomHandler.getMessages);
        socket.on('table:join', _roomHandler.joinTable);
        socket.on('table:send-message', _roomHandler.sendTableMessage);
        socket.on('table:change-media', _roomHandler.changeMedia);
        socket.on('disconnecting', _roomHandler.leaveRoom);
    }

    roomNamespace.on("connection", connection);

}