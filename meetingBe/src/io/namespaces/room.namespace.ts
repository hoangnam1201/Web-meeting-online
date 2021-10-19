import { Socket } from "socket.io";
import roomHandler from '../handlers/room.handler';
import AuthMiddlesware from "../middlewares/auth.middleware";

export default (io: any) => {
    const roomNamespace = io.of('/socket/rooms');

    const _roomHandler = roomHandler(roomNamespace);

    roomNamespace.use(AuthMiddlesware.verifyToken);

    const connection = (socket: Socket) => {
        const userId = socket.data.userData.userId;
        socket.join(userId);
        socket.emit('room:test', 'connected');
        socket.on('disconnecting', _roomHandler.leaveRoom);
        socket.on('room:join', _roomHandler.joinRoom);
        socket.on('room:send-message', _roomHandler.sendMessage);
    }

    roomNamespace.on("connection", connection);
}