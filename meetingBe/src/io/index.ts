import { Server as HttpServer } from 'http';
import { RedisClient } from 'redis';
import { Server, Socket } from 'socket.io';
import userHandler from './handlers/user.handler';
import AuthMiddlesware from './middlewares/auth.middleware';
import roomNamespace from './namespaces/room.namespace';

export const initIOServer = (httpServer: HttpServer) => {
    const io = new Server(httpServer, {
        cors: {
            origin: 'http://localhost:3000',
            methods: ['GET', 'POST'],
        }
    });
    io.use(AuthMiddlesware.verifyToken);

    const _userHandler = userHandler(io);

    roomNamespace(io);

    io.on('connection', (socket) => {
        _userHandler.connect(socket);
        socket.on('disconnect', _userHandler.disconnect);
    })
}
