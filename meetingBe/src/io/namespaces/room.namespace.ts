import { Socket } from "socket.io";
import roomHandler from "../handlers/room.handler";
import AuthMiddlesware from "../middlewares/auth.middleware";

export default (io: any) => {
  const roomNamespace = io.of("/rooms");

  const _roomHandler = roomHandler(roomNamespace, io);

  roomNamespace.use(AuthMiddlesware.verifyToken);

  const connection = (socket: Socket) => {
    const userId = socket.data.userData.userId;
    socket.join(userId);
    socket.on("floor:join", _roomHandler.joinFloor);
    socket.on("room:join", _roomHandler.joinRoom);
    socket.on("room:close", _roomHandler.closeRoom);
    socket.on("room:kick", _roomHandler.kickUser);
    socket.on("room:buzz", _roomHandler.buzzUser);
    socket.on("room:get-messages", _roomHandler.getMessages);
    socket.on("room:send-message", _roomHandler.sendMessage);
    socket.on("room:present", _roomHandler.present);
    socket.on("room:accept-request", _roomHandler.acceptRequest);
    socket.on("room:divide-tables", _roomHandler.divideTables);
    socket.on("room:call-all", _roomHandler.callAll);
    socket.on("room:close-call-all", _roomHandler.closeCallAll);
    socket.on("room:share-screen", _roomHandler.shareScreen);
    socket.on("room:stop-share-screen", _roomHandler.stopShareScreen);
    socket.on("table:join", _roomHandler.joinTable);
    socket.on("table:join-previous", _roomHandler.joinPreviousTable);
    socket.on("table:send-message", _roomHandler.sendTableMessage);
    socket.on("table:share-screen", _roomHandler.tableShareScreen);
    socket.on("table:stop-share-screen", _roomHandler.tableStopShareScreen);
    socket.on("change-media", _roomHandler.changeMedia);
    socket.on("disconnecting", _roomHandler.leaveRoom);
    socket.on("present:join", _roomHandler.joinPresent);
    socket.on("present:stop", _roomHandler.stopPresenting);
    socket.on("table:leave", _roomHandler.leaveTable);
  };
  roomNamespace.on("connection", connection);
};
