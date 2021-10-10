import { Types } from "mongoose";
import { Socket } from "socket.io";
import { UserReadCallDto } from "../../Dtos/user-read-call.dto";
import roomModel, { Room } from "../../models/room.model";
import { User } from "../../models/user.model";

export default (io: any) => {

    const joinRoom = function (roomId: string) {
        const socket = this;
        const userId = socket.data.userData.userId;

        roomModel.findOne({ $or: [{ _id: roomId, members: userId }, { _id: roomId, owner: userId }] }).then((result: Room) => {
            if (!result) {
                socket.emit('room:join-err', 'You are not a class member, Please wait for the room owner to accept');
                roomModel.findOneAndUpdate({ _id: roomId, requests: { $ne: userId } }, { $push: { requests: userId } }, { timestamps: true, new: true }).exec((err: any, room: Room) => {
                    if (err) return socket.emit('room:join-err', 'error to join room');
                    if (!room) return socket.emit('error:bad-request', 'not found room');
                    io.to(roomId).emit('room:user-request', room.requests);
                })
                return;
            }

            socket.join(roomId);
            socket.data.roomId = roomId;
            roomModel.findOneAndUpdate({ _id: roomId }, { $push: { joiners: userId } }, { timestamps: true, new: true }).populate('joiners').exec((err: any, room: Room) => {
                if (err) return socket.emit('room:join-err', 'error to join room');
                if (!room) return socket.emit('error:bad-request', 'not found room');
                io.to(roomId).emit('room:user-joined', UserReadCallDto.fromArrayUser(room.joiners as User[]));
            });
        }).catch((err: any) => {
            if (err) socket.emit('room:join-err', 'error to join room');
        })

    }

    const leaveRoom = function () {
        const socket = this;
        const roomId = socket.data.roomId;
        const userId = socket.data.userData.userId;
        roomModel.findOneAndUpdate({ _id: roomId }, { $pull: { joiners: userId } }, { timestamps: true, new: true }).populate('joiners').exec((err: any, room: Room) => {
            if (err) return;
            if (!room) return socket.emit('error:bad-request', 'not found room');
            io.to(roomId).emit('room:user-joined', room.joiners);
        });
    }

    return {
        joinRoom,
        leaveRoom
    }

}