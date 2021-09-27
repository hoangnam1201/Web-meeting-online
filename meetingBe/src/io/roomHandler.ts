import { randomUUID } from 'crypto'

export default (io: any) => {

    const joinRoom = function (roomId: string) {
        const socket = this;
        socket.join(roomId);
        io.to(roomId).emit('user-connect', 'user connected');
    }

    const createRoom = function () {
        const socket = this;
        const roomId = randomUUID();
        socket.join(roomId);
        socket.emit('created-room', roomId);
    }

    return {
        joinRoom,
        createRoom,
    }

}