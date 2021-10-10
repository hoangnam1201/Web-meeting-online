import { Socket } from "socket.io";

export default (io: any) => {

    const connect = (socket: Socket) => {
        const userId = socket.data.userData.userId;
        socket.join(userId);
    }

    const disconnect = function () {
        const socket = this;
        // nothing
    }

    return {
        connect,
        disconnect
    }
}