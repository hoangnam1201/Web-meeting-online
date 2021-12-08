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
        const socket = this;
        const userId = socket.data.userData.userId;
        try {
            const check = await roomModel.exists({ $or: [{ _id: roomId, members: userId }, { _id: roomId, owner: userId }] })
            if (check) {
                socket.join(roomId);
                socket.data.roomId = roomId;
                // await userModel.updateOne({ _id: userId }, { peerId });

                const room = await roomModel.findOneAndUpdate({ _id: roomId }, { $addToSet: { joiners: userId } }, { timestamps: true, new: true }).populate('joiners')
                if (!room) return socket.emit('error:bad-request', 'not found room');

                socket.emit('room:joined', RoomReadDetailDto.fromRoom(room));
                ioRoom.to(roomId).emit('room:user-joined', UserReadDto.fromArrayUser(room.joiners as User[]));

                const tables = await tableModel.find({ room: room._id }).populate('users');
                socket.emit('room:tables', TableReadDto.fromArray(tables));

                const messages = await messageModel.find({ room: new mongoose.Types.ObjectId(roomId) as any }).populate('sender')
                    .sort({ createdAt: -1 }).skip(0).limit(20);
                socket.emit('room:messages', MessageReadDto.fromArray(messages));

            } else {
                socket.emit('room:join-err', 'You are not a class member, Please wait for the room owner to accept');
                const user = await userModel.findById(userId);
                const room = await roomModel.findById(roomId);
                if (user) ioRoom.to(room.owner).emit('room:user-request', UserReadDto.fromUser(user));
            }

        } catch (err) {
            console.log(err);
            socket.emit('room:err', { err });
        }
    }

    const leaveRoom = async function () {
        const socket = this;
        const roomId = socket.data.roomId;
        const userId = socket.data.userData.userId;
        roomModel.findOneAndUpdate({ _id: roomId }, { $pull: { joiners: userId } }, { timestamps: true, new: true }).populate('joiners').exec((err: any, room: Room) => {
            if (err) return;
            if (!room) return socket.emit('room:bad-request', 'not found room');
            ioRoom.to(roomId).emit('room:user-joined', room.joiners);
        });

        const tableId = socket.data.tableId;
        if (!tableId) return;
        try {
            await tableModel.updateOne({ _id: tableId }, { $pull: { users: userId } });
            const tables = await tableModel.find({ room: roomId }).populate('users');
            io.of('/socket/rooms').to(roomId).emit('room:tables', TableReadDto.fromArray(tables))
            ioRoom.to(tableId).emit('table:user-leave', userId);
        } catch (err) {
            socket.emit('table:err', err)
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


    const joinTable = async function (tableId: string, peerId: string) {
        const socket: Socket = this;
        const userId = socket.data.userData.userId;
        const roomId = socket.data.roomId;

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
            ioRoom.to(tableId).emit('table:user-joined', { user, peerId });
            socket.join(tableId);
            socket.data.tableId = tableId;
            socket.emit('table:join-success', tableId);
        } catch (err) {
            console.log(err)
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
            console.log(err)
            socket.emit('table:err', err)
        }
    }

    const changeMedia = async function () {
        const socket: Socket = this;
        const tableId = socket.data.tableId;
        ioRoom.to(tableId).emit('table:media', 'changes');
    }
    return {
        joinRoom,
        leaveRoom,
        sendMessage,
        getMessages,
        sendTableMessage,
        joinTable,
        changeMedia
    }

}