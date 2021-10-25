import mongoose from "mongoose";
import { Socket } from "socket.io";
import { RoomReadDetailDto } from "../../Dtos/room-detail.dto";
import { RoomReadDto } from "../../Dtos/room-read.dto";
import { TableDetailDto } from "../../Dtos/table-detail.dto";
import { UserReadCallDto } from "../../Dtos/user-read-call.dto";
import { UserReadDto } from "../../Dtos/user-read.dto";
import messageModel, { Message } from "../../models/message.model";
import roomModel, { Room } from "../../models/room.model";
import tableModel, { Table } from "../../models/table.model";
import userModel, { User } from "../../models/user.model";

export default (ioRoom: any, io: any) => {

    const joinRoom = async function (roomId: string, peerId: string) {
        const socket = this;
        const userId = socket.data.userData.userId;
        try {
            const check = await roomModel.exists({ $or: [{ _id: roomId, members: userId }, { _id: roomId, owner: userId }] })
            if (check) {
                socket.join(roomId);
                socket.data.roomId = roomId;
                await userModel.updateOne({ _id: userId }, { peerId });

                const room = await roomModel.findOneAndUpdate({ _id: roomId }, { $push: { joiners: userId } }, { timestamps: true, new: true }).populate('joiners')
                if (!room) return socket.emit('error:bad-request', 'not found room');

                socket.emit('room:joined', RoomReadDetailDto.fromRoom(room));
                ioRoom.to(roomId).emit('room:user-joined', UserReadDto.fromArrayUser(room.joiners as User[]));

                const tables = await tableModel.find({ room: room._id }).populate('users');
                socket.emit('room:tables', TableDetailDto.fromArray(tables));

                const messages = await messageModel.find({ room: new mongoose.Types.ObjectId(roomId) as any })
                    .sort({ createdAt: -1 }).skip(0).limit(20);
                socket.emit('room:messages', messages)

            } else {
                socket.emit('room:join-err', 'You are not a class member, Please wait for the room owner to accept');
                const room = roomModel.findOneAndUpdate({ _id: roomId, requests: { $ne: userId } }, { $push: { requests: userId } }, { timestamps: true, new: true });
                if (!room) return socket.emit('error:bad-request', 'not found room');
                ioRoom.to(roomId).emit('room:user-request', room.requests);
            }

        } catch (err) {
            console.log(err);
            socket.emit('room:err', { err });
        }

    }

    const leaveRoom = function () {
        const socket = this;
        const roomId = socket.data.roomId;
        const userId = socket.data.userData.userId;
        roomModel.findOneAndUpdate({ _id: roomId }, { $pull: { joiners: userId } }, { timestamps: true, new: true }).populate('joiners').exec((err: any, room: Room) => {
            if (err) return;
            if (!room) return socket.emit('room:bad-request', 'not found room');
            ioRoom.to(roomId).emit('room:user-joined', room.joiners);
        });
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

    return {
        joinRoom,
        leaveRoom,
        sendMessage,
    }

}