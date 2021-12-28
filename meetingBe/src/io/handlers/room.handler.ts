import mongoose from "mongoose";
import { Socket } from "socket.io";
import { TableReadDto } from "../../Dtos/table-read.dto";
import { UserTableReadDto } from "../../Dtos/user-table-read.dto";
import { MessageReadDto } from "../../Dtos/message-read.dto";
import { RoomReadDetailDto } from "../../Dtos/room-detail.dto";
import { TableDetailDto } from "../../Dtos/table-detail.dto";
import { UserReadDto } from "../../Dtos/user-read.dto";
import messageModel, { Message } from "../../models/message.model";
import roomModel, { Room } from "../../models/room.model";
import tableModel, { Table } from "../../models/table.model";
import userModel, { User } from "../../models/user.model";

export default (ioRoom: any, io: any) => {

    const joinRoom = async function (roomId: string) {
        const socket: Socket = this;
        const userId = socket.data.userData.userId;
        try {
            const check = await roomModel.exists({ $or: [{ _id: roomId, members: userId }, { _id: roomId, owner: userId }] })
            if (check) {
                socket.join(roomId);
                socket.data.roomId = roomId;
                // await userModel.updateOne({ _id: userId }, { peerId });

                const room = await roomModel.findOneAndUpdate({ _id: roomId }, { $addToSet: { joiners: userId } }, { timestamps: true, new: true }).populate('joiners')
                if (!room) return socket.emit('error:bad-request', 'not found room');


                socket.emit('room:info', RoomReadDetailDto.fromRoom(room));
                ioRoom.to(roomId).emit('room:user-joined', UserReadDto.fromArrayUser(room.joiners as User[]));

                const tables = await tableModel.find({ room: room._id }).populate('users');
                socket.emit('room:tables', TableReadDto.fromArray(tables));

                if (room.isPresent)
                    ioRoom.to(roomId).emit('room:present', { time: 1, tables });

                const messages = await messageModel.find({ room: new mongoose.Types.ObjectId(roomId) as any }).populate('sender')
                    .sort({ createdAt: -1 }).skip(0).limit(20);
                socket.emit('room:messages', MessageReadDto.fromArray(messages));

            } else {
                socket.emit('room:join-err', {
                    msg: 'You are not a class member, Please wait for the room owner to accept',
                    type: 'REQUEST'
                });

                const user = await userModel.findById(userId);
                const room = await roomModel.findById(roomId);
                if (user) ioRoom.to(room.owner.toString()).emit('room:user-request',
                    {
                        user: UserReadDto.fromUser(user),
                        socketId: socket.id
                    });
            }

        } catch (err) {
            socket.emit('room:err', { err });
        }
    }

    const acceptRequest = async function (socketId: string, userId: string, accept: string) {
        const socket = this;
        const roomId = socket.data.roomId;

        if (!accept)
            return ioRoom.to(socketId).emit('room:join-err', { msg: 'Your request has been declined', type: 'REFUSE' });

        try {
            const room = await roomModel.findOneAndUpdate({ _id: roomId }, { $addToSet: { joiners: userId } }, { timestamps: true, new: true }).populate('joiners')
            if (!room) return socket.emit('error:bad-request', 'not found room');
            const clientSocket = ioRoom.sockets.get(socketId);
            clientSocket.join(roomId);
            clientSocket.data.roomId = roomId;

            ioRoom.to(socketId).emit('room:info', RoomReadDetailDto.fromRoom(room));
            ioRoom.to(roomId).emit('room:user-joined', UserReadDto.fromArrayUser(room.joiners as User[]));

            const tables = await tableModel.find({ room: room._id }).populate('users');
            ioRoom.to(socketId).emit('room:tables', TableReadDto.fromArray(tables));

            if (room.isPresent)
                ioRoom.to(roomId).emit('room:present', { time: 1, tables });

            const messages = await messageModel.find({ room: new mongoose.Types.ObjectId(roomId) as any }).populate('sender')
                .sort({ createdAt: -1 }).skip(0).limit(20);
            ioRoom.to(socketId).emit('room:messages', MessageReadDto.fromArray(messages));
        } catch (err) {
            console.log(err);
            socket.emit('room:err', 'Internal Server Error');
        }
    }

    const leaveRoom = async function () {
        const socket = this;
        const roomId = socket.data.roomId;
        const userId = socket.data.userData.userId;
        const peerId = socket.data.peerId;

        roomModel.findOneAndUpdate({ _id: roomId }, { $pull: { joiners: userId } }, { timestamps: true, new: true }).populate('joiners').exec((err: any, room: Room) => {
            if (err) return;
            if (!room) return socket.emit('room:bad-request', 'not found room');
            ioRoom.to(roomId).emit('room:user-joined', room.joiners);
        });

        const tableId = socket.data.tableId;
        if (tableId) {
            try {
                await tableModel.updateOne({ _id: tableId }, { $pull: { users: userId } });
                const tables = await tableModel.find({ room: roomId }).populate('users');
                io.of('/socket/rooms').to(roomId).emit('room:tables', TableReadDto.fromArray(tables))
                ioRoom.to(tableId).emit('table:user-leave', { userId, peerId });
            } catch (err) {
                socket.emit('table:err', err)
            }

        }

        try {
            const room = await roomModel.findById(roomId);
            if (room.isPresent === false) return;
            if (room.owner.toString() === userId) {
                const roomInfo = await roomModel.findByIdAndUpdate(roomId, { isPresent: false }, { new: true });
                ioRoom.to(roomId).emit('room:info', RoomReadDetailDto.fromRoom(roomInfo));
                ioRoom.to(roomId).emit('present:close');
            }
            ioRoom.to(roomId).emit('present:user-leave', { userId, peerId });
        } catch (err) {
            socket.emit('room:err', err)
        }
    }

    const sendMessage = async function (strMessage: string) {
        const socket = this;
        const roomId = socket.data.roomId;
        const userId = socket.data.userData.userId;
        const newMessage = {
            message: strMessage,
            sender: userId,
            room: roomId,
        };
        try {
            const message = await messageModel.create(newMessage);
            const messageRead = await messageModel.findById(message._id).populate('sender');
            socket.emit('room:send-message-status', { message: 'success' });
            ioRoom.to(roomId).emit('room:message', messageRead)
        } catch (err: any) {
            return socket.emit('room:send-message-status', { err: 'error to send message' });
        }
    }

    const getMessages = async function (pageIndex = 0) {
        const socket = this;
        const roomId = socket.data.roomId;
        const messages = await messageModel.find({ room: new mongoose.Types.ObjectId(roomId) as any }).populate('sender')
            .sort({ createdAt: -1 }).skip(pageIndex * 20).limit(20);
        socket.emit('room:messages', MessageReadDto.fromArray(messages));
    }


    const joinTable = async function (tableId: string, peerId: string, media: { audio: boolean, video: boolean }) {
        const socket: Socket = this;
        const userId = socket.data.userData.userId;
        const roomId = socket.data.roomId

        try {
            const table: Table = await tableModel.findById(tableId);
            if (table.numberOfSeat <= table.users.length) {
                socket.emit('table:join-err', 'the table is full');
                return
            }

            const tableIdTemp = socket.data.tableId;
            if (tableIdTemp) {
                socket.leave(tableIdTemp);
                await tableModel.findByIdAndUpdate(tableIdTemp, { $pull: { users: userId } }, { new: true }).populate('users');
                ioRoom.to(tableIdTemp).emit('table:user-leave', { userId, peerId });
            }

            await tableModel.updateMany({ room: roomId }, { $pull: { users: userId } });

            await tableModel.updateOne({ _id: tableId }, { $addToSet: { users: userId } });
            const tables = await tableModel.find({ room: roomId }).populate('users');
            ioRoom.to(roomId).emit('room:tables', TableReadDto.fromArray(tables))

            const user = await userModel.findById(userId);
            ioRoom.to(tableId).emit('table:user-joined', { user: UserReadDto.fromUser(user), peerId, media });
            socket.join(tableId);

            socket.data.tableId = tableId;
            socket.data.peerId = peerId;
            socket.emit('table:join-success', tableId);
        } catch (err) {
            socket.emit('table:err', err)
        }
    }

    const sendTableMessage = async function (msgString: string) {
        const socket = this;
        const userId = socket.data.userData.userId;
        const tableId = socket.data.tableId;
        try {
            const sender = await userModel.findById(userId);
            const message = { sender: UserReadDto.fromUser(sender), message: msgString, createAt: new Date() };
            ioRoom.to(tableId).emit('table:message', message);
        } catch (err) {
            socket.emit('table:err', err)
        }
    }

    const changeMedia = async function (media: { audio: boolean, video: boolean }, type: string) {
        const socket: Socket = this;
        const tableId = socket.data.tableId;
        const userId = socket.data.userData.userId;
        const peerId = socket.data.peerId;
        const roomId = socket.data.roomId;

        if (type.toLowerCase() === 'present') {
            ioRoom.to(roomId).emit('present:media', { peerId: peerId, userId: userId, media });
            return
        }
        ioRoom.to(tableId).emit('table:media', { peerId: peerId, userId: userId, media });

    }

    const present = async function (time: number) {
        const socket: Socket = this;
        const roomId = socket.data.roomId;
        const userId = socket.data.userData.userId;

        if (!roomId) return;
        try {
            const checkRoom = await roomModel.findById(roomId);
            if (checkRoom.owner.toString() !== userId) return socket.emit('room:err', 'You do not have permission to present')

            const room = await roomModel.findByIdAndUpdate(roomId, { isPresent: true }, { new: true });

            await tableModel.updateMany({ room: roomId }, { users: [] });
            const tables = await tableModel.find({ room: roomId }).populate('users');
            ioRoom.to(roomId).emit('room:present', { time, tables });

            setTimeout(() => {
                ioRoom.to(roomId).emit('room:info', RoomReadDetailDto.fromRoom(room));
            }, 1000 * time)
        } catch (err) {
            return socket.emit('room:err', 'Internal Server Error');
        }
    }

    const joinPresent = async function (peerId: string, media: { audio: boolean, video: boolean }) {
        const socket: Socket = this;
        const roomId = socket.data.roomId;
        const userId = socket.data.userData.userId;
        socket.data.peerId = peerId;

        try {

            const tableIdTemp = socket.data.tableId;
            if (tableIdTemp) {
                socket.leave(tableIdTemp);
            }

            const room = await roomModel.findById(roomId);
            if (room.isPresent !== true) return;
            const user = await userModel.findById(userId);
            ioRoom.to(roomId).emit('present:user-joined', { user: UserReadDto.fromUser(user), peerId, media });
        } catch (err) {
            return socket.emit('room:err', 'Internal Server Error');
        }
    }

    const stopPresenting = async function () {
        const socket: Socket = this;
        const roomId = socket.data.roomId;
        const userId = socket.data.userData.userId;

        try {
            const room = await roomModel.findById(roomId);
            if (room.isPresent === false) return;

            if (room.owner.toString() !== userId)
                return socket.emit('room:err', 'You do not have permission to present')

            const roomInfo = await roomModel.findByIdAndUpdate(roomId, { isPresent: false }, { new: true });
            ioRoom.to(roomId).emit('room:info', RoomReadDetailDto.fromRoom(roomInfo));
            ioRoom.to(roomId).emit('present:close')

        } catch (err) {
            return socket.emit('room:err', 'Internal Server Error');
        }
    }

    const leaveTable = async function name(peerId: string) {
        const socket: Socket = this;
        const userId = socket.data.userData.userId;
        const roomId = socket.data.roomId;

        try {
            const tableIdTemp = socket.data.tableId;
            if (tableIdTemp) {
                socket.leave(tableIdTemp);
                await tableModel.updateOne({ _id: tableIdTemp }, { $pull: { users: userId } }, { new: true });
                ioRoom.to(tableIdTemp).emit('table:user-leave', { userId, peerId });

                const tables = await tableModel.find({ room: roomId })
                    .populate({ path: 'users', select: 'name _id username email' })
                ioRoom.to(roomId).emit('room:tables', tables);
            }
        } catch (err) {
            socket.emit('table:err', err)
        }
    }

    const pin = async function name() {
        const socket: Socket = this;
        const userId = socket.data.userData.userId;
        const roomId = socket.data.roomId;
        const peerId = socket.data.peerId;
        ioRoom.to(roomId).emit('present:pin', { userId, peerId });
    }

    const divideTables = async function () {
        const socket: Socket = this;
        const roomId = socket.data.roomId;

        try {
            await tableModel.updateMany({ room: roomId }, { users: [] });
            const tables = await tableModel.find({ room: roomId })
                .populate({ path: 'users', select: 'name _id username email' })
            ioRoom.to(roomId).emit('room:divide-tables', tables);
        } catch {
            return socket.emit('room:err', 'Internal Server Error');
        }
    }

    return {
        joinRoom,
        leaveRoom,
        leaveTable,
        sendMessage,
        present,
        getMessages,
        sendTableMessage,
        joinTable,
        joinPresent,
        stopPresenting,
        changeMedia,
        acceptRequest,
        pin,
        divideTables
    }

}