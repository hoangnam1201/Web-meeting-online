import { Socket } from "socket.io";
import tableHandler from "../handlers/table.handler"
import AuthMiddlesware from "../middlewares/auth.middleware";

export default (io: any) => {
    const tableNamespace = io.of('/socket/tables');

    tableNamespace.use(AuthMiddlesware.verifyToken);
    const _tableHandler = tableHandler(tableNamespace, io);

    const connectionHandler = (socket: Socket) => {
        socket.on('table:join', _tableHandler.joinTable);
        socket.on('table:send-message', _tableHandler.sendMessage);
        socket.on('table:change-media', _tableHandler.changeMedia);
        socket.on('disconnecting', _tableHandler.disconnecting);
    }

    tableNamespace.on('connection', connectionHandler)
}