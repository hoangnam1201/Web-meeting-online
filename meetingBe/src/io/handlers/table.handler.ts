import { Socket } from "socket.io";
import { TableReadDto } from "../../Dtos/table-read.dto";
import { UserReadCallDto } from "../../Dtos/user-read-call.dto";
import { UserReadDto } from "../../Dtos/user-read.dto";
import tableModel, { Table } from "../../models/table.model";
import userModel, { User } from "../../models/user.model";

export default (ioTable: any, io: any) => {
    const joinTable = async function (tableId: string) {
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
                const table = await tableModel.findByIdAndUpdate(tableIdTemp, { $pull: { users: userId } },{new: true}).populate('users');
                ioTable.to(tableIdTemp).emit('table:user-leave', UserReadCallDto.fromArrayUser(table.users as User[]));
            }

            await tableModel.updateMany({ room: roomId }, { $pull: { users: userId } });
            await tableModel.updateOne({ _id: tableId }, { $push: { users: userId } });
            const tables = await tableModel.find({ room: roomId }).populate('users');
            io.of('/socket/rooms').to(roomId).emit('room:tables', TableReadDto.fromArray(tables))

            const users = tables.find((tb: Table) => tb._id.toString() === tableId).users;
            socket.join(tableId);
            ioTable.to(tableId).emit('table:user-joined', UserReadCallDto.fromArrayUser(users as User[]));
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
            await tableModel.updateOne({ _id: tableId }, { $pull: { users: userId } });
            const tables = await tableModel.find({ room: roomId }).populate('users');
            io.of('/socket/rooms').to(roomId).emit('room:tables', TableReadDto.fromArray(tables))

            const table = await tableModel.findById(tableId).populate('users');
            ioTable.to(tableId).emit('table:user-leave', UserReadCallDto.fromArrayUser(table.users as User[]));
        } catch (err) {
            console.log(err)
            socket.emit('table:err', err)
        }
    }

    return {
        joinTable,
        sendMessage,
        disconnecting
    }
}