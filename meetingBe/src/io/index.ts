import { Server } from 'socket.io';
import userHandler from './handlers/user.handler';
import AuthMiddlesware from './middlewares/auth.middleware';
import roomNamespace from './namespaces/room.namespace';
import notificationHandler from './handlers/notification.handler';

export const initIOServer = (io: Server) => {

    io.use(AuthMiddlesware.verifyToken);

    const _userHandler = userHandler(io);
    const _notifyHandler = notificationHandler(io);

    roomNamespace(io);
    // tableNamespace(io);

    io.on('connection', (socket) => {
        _userHandler.connect(socket);
        _notifyHandler.getNotification(socket);
        socket.on('disconnect', _userHandler.disconnect);
    })
}
