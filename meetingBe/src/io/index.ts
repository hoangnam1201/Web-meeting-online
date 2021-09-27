import { Server as HttpServer } from 'http';
import { Server, Socket } from 'socket.io';
import roomHandler from './roomHandler';

export const initIOServer = (httpServer: HttpServer) => {
    const io = new Server(httpServer, {
        cors: {
            origin: 'http://localhost:3000',
            methods: ['GET', 'POST']
        }
    });
    const _roomHandler = roomHandler(io);

    const connection = (socket: Socket) => {
        socket.on('room:create', _roomHandler.createRoom);
        socket.on('room:join', _roomHandler.joinRoom);
    }

    io.on('connection', connection);
}
