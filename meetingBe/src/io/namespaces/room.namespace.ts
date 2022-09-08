import { Socket } from "socket.io";
import roomHandler from "../handlers/room.handler";
import AuthMiddlesware from "../middlewares/auth.middleware";

export default (io: any) => {
  const roomNamespace = io.of("/socket/rooms");

  const _roomHandler = roomHandler(roomNamespace, io);

  roomNamespace.use(AuthMiddlesware.verifyToken);

  const connection = (socket: Socket) => {
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
