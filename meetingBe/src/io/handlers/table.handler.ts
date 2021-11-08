import { Socket } from "socket.io";
import { TableReadDto } from "../../Dtos/table-read.dto";
import { UserReadDto } from "../../Dtos/user-read.dto";
import { UserTableReadDto } from "../../Dtos/user-table-read.dto";
import tableModel, { Table } from "../../models/table.model";
import userModel, { User } from "../../models/user.model";

export default (ioTable: any, io: any) => {
    const joinTable = async function (tableId: string, mediaOption: { audio: boolean, video: boolean }, peerId: string) {
        const socket: Socket = this;
        const userId = socket.data.userData.userId;
        const roomId = socket.handshake.auth.roomId;
        try {
            const table: Table = await tableModel.findById(tableId);
            if (table.numberOfSeat <= table.users.length) {
                socket.emit('table:join-err', 'the table is full');
                return
            }
            const tableIdTemp = socket.data.tableId;
            if (tableIdTemp) {
                socket.leave(tableIdTemp);
                const table = await tableModel.findByIdAndUpdate(tableIdTemp, { $pull: { users: { user: userId } } }, { new: true }).populate('users.user');
                ioTable.to(tableIdTemp).emit('table:user-leave', UserTableReadDto.fromArray(table.users));
            }

            await tableModel.updateMany({ room: roomId }, { $pull: { users: { user: userId } } });
            const element = { user: userId, ...mediaOption, peerId }
            await tableModel.updateOne({ _id: tableId }, { $push: { users: element } });
            const tables = await tableModel.find({ room: roomId }).populate('users.user');
            io.of('/socket/rooms').to(roomId).emit('room:tables', TableReadDto.fromArray(tables))

            socket.join(tableId);
            const users = tables.find((tb: Table) => tb._id.toString() === tableId).users;
            ioTable.to(tableId).emit('table:user-joined', UserTableReadDto.fromArray(users));
            socket.data.tableId = tableId;
            socket.emit('table:join-success', tableId);
        } catch (err) {
            console.log(err)
            socket.emit('table:err', err)
        }
    }

    const sendMessage = async function (msgString: string) {
        const socket = this;
        const userId = socket.data.userData.userId;
        const tableId = socket.data.tableId;
        try {
            const sender = await userModel.findById(userId);
            const message = { sender: UserReadDto.fromUser(sender), message: msgString, createAt: new Date() };
            ioTable.to(tableId).emit('table:message', message);
        } catch (err) {
            console.log(err)
            socket.emit('table:err', err)
        }
    }

    const disconnecting = async function () {
        const socket: Socket = this;
        const tableId = socket.data.tableId;
        const userId = socket.data.userData.userId;
        const roomId = socket.handshake.auth.roomId;
        try {
            await tableModel.updateOne({ _id: tableId }, { $pull: { users: { user: userId } } });
            const tables = await tableModel.find({ room: roomId }).populate('users.user');
            io.of('/socket/rooms').to(roomId).emit('room:tables', TableReadDto.fromArray(tables))

            const table = await tableModel.findById(tableId).populate('users.user');
            if (table)
                ioTable.to(tableId).emit('table:user-leave', UserTableReadDto.fromArray(table.users));
        } catch (err) {
            socket.emit('table:err', err)
        }
    }

    const changeMedia = async function (mediaOption: { audio: boolean, video: boolean }) {
        const socket: Socket = this;
        const tableId = socket.data.tableId;
        const userId = socket.data.userData.userId;

        try {
            await tableModel.updateOne({ _id: tableId, 'users.user': userId }, {
                $set: {
                    'users.$.video': mediaOption.video,
                    'users.$.audio': mediaOption.audio,
                }
            })
            const table = await tableModel.findById(tableId).populate('users.user');
            if (table) ioTable.to(tableId).emit('table:change-media', UserTableReadDto.fromArray(table.users));
        } catch (err) {
            console.log(err);
            socket.emit('table:err', err)
        }
    }

    return {
        joinTable,
        sendMessage,
        disconnecting,
        changeMedia
    }
}