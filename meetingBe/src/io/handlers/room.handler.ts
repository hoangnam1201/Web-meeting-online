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
import { User } from "../../models/user.model";

export default (io: any) => {

    const joinRoom = function (roomId: string, peerId: string) {
        const socket = this;
        const userId = socket.data.userData.userId;

        roomModel.findOne({ $or: [{ _id: roomId, members: userId }, { _id: roomId, owner: userId }] }).then((result: Room) => {
            if (!result) {
                socket.emit('room:join-err', 'You are not a class member, Please wait for the room owner to accept');
                roomModel.findOneAndUpdate({ _id: roomId, requests: { $ne: userId } }, { $push: { requests: userId } }, { timestamps: true, new: true }).exec((err: any, room: Room) => {
                    console.log(err)
                    if (err) return socket.emit('room:join-err', 'error to join room');
                    if (!room) return socket.emit('error:bad-request', 'not found room');
                    io.to(roomId).emit('room:user-request', room.requests);
                })
                return;
            }

            socket.join(roomId);
            socket.data.roomId = roomId;
            roomModel.findOneAndUpdate({ _id: roomId }, { $push: { joiners: userId } }, { timestamps: true, new: true }).populate('joiners').exec((err: any, room: Room) => {
                console.log(err)
                if (err) return socket.emit('room:join-err', 'error to join room');
                if (!room) return socket.emit('error:bad-request', 'not found room');
                io.to(roomId).emit('room:user-joined', UserReadDto.fromArrayUser(room.joiners as User[]));
                socket.emit('room:joined', RoomReadDetailDto.fromRoom(room));
                tableModel.find({ room: room._id }, (errTable: any, tables: Table[]) => {
                    if (errTable) return socket.emit('room:tables-err', { err: 'error to join room' });
                    socket.emit('room:tables', TableDetailDto.fromArray(tables));
                })
                messageModel.find({ room: new mongoose.Types.ObjectId(roomId) as any }, (errMessage, messages) => {
                    if (errMessage) socket.emit('room:message-err', { err: 'error to get message' })
                    console.log(messages)
                    socket.emit('room:message', messages)
                })
            });
        }).catch((err: any) => {
            if (err) socket.emit('room:join-err', { err: 'error to join room' });
        })

    }

    const leaveRoom = function () {
        const socket = this;
        const roomId = socket.data.roomId;
        const userId = socket.data.userData.userId;
        roomModel.findOneAndUpdate({ _id: roomId }, { $pull: { joiners: userId } }, { timestamps: true, new: true }).populate('joiners').exec((err: any, room: Room) => {
            if (err) return;
            if (!room) return socket.emit('room:bad-request', 'not found room');
            io.to(roomId).emit('room:user-joined', room.joiners);
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
            let message = await messageModel.create(newMessage);
            message = await messageModel.findById(message._id).populate('sender');
            socket.emit('room:send-message-status', { message: 'success' });
            io.to(roomId).emit('room:message', [message])
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