import { Socket } from "socket.io";
import { TableReadDto } from "../../Dtos/table-read.dto";
import { MessageReadDto } from "../../Dtos/message-read.dto";
import { RoomReadDetailDto } from "../../Dtos/room-detail.dto";
import { UserReadDto } from "../../Dtos/user-read.dto";
import { Room } from "../../models/room.model";
import { Table } from "../../models/table.model";
import { User } from "../../models/user.model";
import UserService from "../../services/user.service";
import FileService from "../../services/file.service";
import MessageService from "../../services/message.service";
import RoomService from "../../services/room.service";
import TableService from "../../services/table.service";

export default (ioRoom: any, io: any) => {
  const userService = UserService();
  const fileService = FileService();
  const roomService = RoomService();
  const tableService = TableService();
  const messageService = MessageService();

  const joinRoom = async function (roomId: string) {
    const socket: Socket = this;
    const userId = socket.data.userData.userId;
    try {
      const check = await roomService.checkCanAccept(roomId, userId);
      // is class member
      if (check) {
        socket.join(roomId);
        socket.data.roomId = roomId;

        const room = await roomService.findOneAndAddJoiner(roomId, userId);
        if (!room) return socket.emit("error:bad-request", "not found room");

        socket.emit("room:info", RoomReadDetailDto.fromRoom(room));
        ioRoom
          .to(roomId)
          .emit(
            "room:user-joined",
            UserReadDto.fromArrayUser(room.joiners as User[])
          );

        //join first floor
        let tables: Table[] = [];
        if (room.floors.length > 0) {
          tables = await tableService.getTablesByRoomAndFloor(
            roomId,
            room.floors[0]
          );
          socket.emit("floor:tables", {
            tables: TableReadDto.fromArray(tables),
            floor: room.floors[0],
          });
          socket.join(room.floors[0].toString());
          socket.data.floor = room.floors[0].toString();
        }

        if (room.isPresent)
          ioRoom.to(roomId).emit("room:present", { time: 1, tables });

        const messages = await messageService.getMessages(roomId, 30, 0);
        socket.emit("room:messages", MessageReadDto.fromArray(messages));
        return;
      }

      //not a class member
      socket.emit("room:join-err", {
        msg: "You are not a class member, Please wait for the room owner to accept",
        type: "REQUEST",
      });

      const user = await userService.findUserById(userId);
      const room = await roomService.findById(roomId);
      if (user)
        ioRoom.to(room.owner.toString()).emit("room:user-request", {
          user: UserReadDto.fromUser(user),
          socketId: socket.id,
        });
    } catch (err) {
      socket.emit("room:err", { err });
    }
  };

  const acceptRequest = async function (
    socketId: string,
    userId: string,
    accept: string
  ) {
    const socket: Socket = this;
    const roomId = socket.data.roomId;
    const clientSocket = ioRoom.sockets.get(socketId);

    if (!accept)
      return ioRoom.to(socketId).emit("room:join-err", {
        msg: "Your request has been declined",
        type: "REFUSE",
      });

    try {
      const room: Room = await roomService.findOneAndAddJoiner(roomId, userId);

      if (!room) return socket.emit("error:bad-request", "not found room");
      clientSocket.join(roomId);
      clientSocket.data.roomId = roomId;

      ioRoom.to(socketId).emit("room:info", RoomReadDetailDto.fromRoom(room));
      ioRoom
        .to(roomId)
        .emit(
          "room:user-joined",
          UserReadDto.fromArrayUser(room.joiners as User[])
        );

      //join first floor
      let tables: Table[] = [];
      if (room.floors.length > 0) {
        tables = await tableService.getTablesByRoomAndFloor(
          roomId,
          room.floors[0]
        );
        clientSocket.emit("floor:tables", {
          tables: TableReadDto.fromArray(tables),
          floor: room.floors[0],
        });
        clientSocket.join(room.floors[0].toString());
        clientSocket.data.floor = room.floors[0].toString();
      }

      if (room.isPresent)
        ioRoom.to(roomId).emit("room:present", { time: 1, tables });

      const messages = await messageService.getMessages(roomId, 20, 0);
      ioRoom
        .to(socketId)
        .emit("room:messages", MessageReadDto.fromArray(messages));
    } catch (err) {
      console.log(err);
      socket.emit("room:err", "Internal Server Error");
    }
  };

  const leaveRoom = async function () {
    const socket: Socket = this;
    const roomId = socket.data.roomId;
    const userId = socket.data.userData.userId;
    const peerId = socket.data.peerId;
    const floor = socket.data.floor;

    try {
      const room = await roomService.findOneAndRemoveJoiner(roomId, userId);
      if (!room) return socket.emit("room:bad-request", "not found room");
      ioRoom.to(roomId).emit("room:user-joined", room.joiners);

      const tableId = socket.data.tableId;
      if (tableId) {
        await tableService.removeJoiner(tableId, userId);
        const tables = await tableService.getTablesByRoomAndFloor(
          roomId,
          floor
        );
        socket
          .in(roomId)
          .to(floor)
          .emit("floor:tables", {
            tables: TableReadDto.fromArray(tables),
            floor,
          });
        ioRoom.to(tableId).emit("table:user-leave", { userId, peerId });
      }

      //stop presenting if user is owner
      if (room.isPresent === false) return;
      if (room.owner.toString() === userId.toString()) {
        const roomInfo = await roomService.findOneAndUpdatePresent(
          roomId,
          false
        );
        ioRoom
          .to(roomId)
          .emit("room:info", RoomReadDetailDto.fromRoom(roomInfo));
        ioRoom.to(roomId).emit("present:close");
      }
      ioRoom.to(roomId).emit("present:user-leave", { userId, peerId });
    } catch (err) {
      socket.emit("room:err", err);
    }
  };

  const sendMessage = async function (
    data: { files: [{ data: Buffer; name: string }]; msgString: string },
    callBack: (status: string) => void
  ) {
    const socket = this;
    const userId = socket.data.userData.userId;
    const roomId = socket.data.roomId;

    try {
      const files = await Promise.all(
        data.files.map(async (f) => {
          const id = await fileService.putFile(f.name, f.data);
          return { fileId: id.toString(), name: f.name };
        })
      );
      const message = await messageService.create(
        userId,
        roomId,
        data.msgString,
        files
      );
      ioRoom
        .to(roomId)
        .emit("room:message", MessageReadDto.fromMessage(message));
      callBack && callBack("success");
    } catch {
      callBack && callBack("error to send message");
    }
  };

  const sendTableMessage = async function (data: {
    files: [{ data: Buffer; name: string }];
    msgString: string;
  }) {
    const socket = this;
    const userId = socket.data.userData.userId;
    const tableId = socket.data.tableId;
    const sender = await userService.findUserById(userId);

    const message = {
      sender: UserReadDto.fromUser(sender),
      files: data.files,
      message: data.msgString,
      createAt: new Date(),
    };
    ioRoom.to(tableId).emit("table:message", message);
  };

  const getMessages = async function (pageIndex = 0) {
    const socket = this;
    const roomId = socket.data.roomId;
    const messages = await messageService.getMessages(
      roomId,
      20,
      pageIndex * 20
    );
    socket.emit("room:messages", MessageReadDto.fromArray(messages));
  };

  const joinTable = async function (
    tableId: string,
    peerId: string,
    media: { audio: boolean; video: boolean }
  ) {
    const socket: Socket = this;
    const userId = socket.data.userData.userId;
    const roomId = socket.data.roomId;
    const floor = socket.data.floor;

    try {
      //check full table
      const table: Table = await tableService.getById(tableId);
      if (table.numberOfSeat <= table.users.length) {
        socket.emit("table:join-err", "the table is full");
        return;
      }

      // check previous tables
      const tableIdTemp = socket.data.tableId;
      if (tableIdTemp) {
        socket.leave(tableIdTemp);
        await tableService.removeJoiner(tableIdTemp, userId);
        ioRoom.to(tableIdTemp).emit("table:user-leave", { userId, peerId });
      }

      //join new table
      await tableService.addJoiner(roomId, tableId, userId);
      const tables = await tableService.getTablesByRoomAndFloor(roomId, floor);
      ioRoom.to(floor).emit("floor:tables", {
        tables: TableReadDto.fromArray(tables),
        floor,
      });

      const user = await userService.findUserById(userId);
      ioRoom.to(tableId).emit("table:user-joined", {
        user: UserReadDto.fromUser(user),
        peerId,
        media,
      });
      socket.join(tableId);

      socket.data.tableId = tableId;
      socket.data.peerId = peerId;
      socket.emit("table:join-success", tableId);
    } catch (err) {
      socket.emit("table:err", err);
    }
  };

  const joinPreviousTable = async function (
    peerId: string,
    media: { audio: boolean; video: boolean }
  ) {
    const socket: Socket = this;
    const userId = socket.data.userData.userId;
    const roomId = socket.data.roomId;
    const floor = socket.data.floor;
    const tableId = socket.data.tableId;

    try {
      //check full table
      const table: Table = await tableService.getById(tableId);
      if (table.numberOfSeat <= table.users.length) {
        socket.emit("table:join-err", "the table is full");
        return;
      }

      //join new table
      await tableService.addJoiner(roomId, tableId, userId);
      const tables = await tableService.getTablesByRoomAndFloor(roomId, floor);
      ioRoom.to(floor).emit("floor:tables", {
        tables: TableReadDto.fromArray(tables),
        floor,
      });

      const user = await userService.findUserById(userId);
      ioRoom.to(tableId).emit("table:user-joined", {
        user: UserReadDto.fromUser(user),
        peerId,
        media,
      });
      socket.join(tableId);

      socket.data.tableId = tableId;
      socket.data.peerId = peerId;
      socket.emit("table:join-success", tableId);
    } catch (err) {
      socket.emit("table:err", err);
    }
  };

  const joinFloor = async function (floor: string) {
    const socket: Socket = this;
    const roomId = socket.data.roomId;
    const previousFloor = socket.data.floor;
    socket.leave(previousFloor);
    const tables = await tableService.getTablesByRoomAndFloor(roomId, floor);
    socket.emit("floor:tables", {
      tables: TableReadDto.fromArray(tables),
      floor,
    });
    //save new floor
    socket.data.floor = floor;
    socket.join(floor);
  };

  const changeMedia = async function (
    media: { audio: boolean; video: boolean },
    type: string
  ) {
    const socket: Socket = this;
    const tableId = socket.data.tableId;
    const userId = socket.data.userData.userId;
    const peerId = socket.data.peerId;
    const roomId = socket.data.roomId;

    if (type.toLowerCase() === "present") {
      ioRoom
        .to(roomId)
        .emit("present:media", { peerId: peerId, userId: userId, media });
      return;
    }
    ioRoom
      .to(tableId)
      .emit("table:media", { peerId: peerId, userId: userId, media });
  };

  const present = async function (time: number) {
    const socket: Socket = this;
    const roomId = socket.data.roomId;
    const userId = socket.data.userData.userId;

    if (!roomId) return;
    try {
      const checkRoom = await roomService.findById(roomId);
      if (checkRoom.owner.toString() !== userId.toString())
        return socket.emit("room:err", "You do not have permission to present");

      const room = await roomService.findOneAndUpdatePresent(roomId, true);
      await tableService.findAndClearJoiner(roomId);
      ioRoom.to(roomId).emit("room:present", { time, tables: [] });

      setTimeout(() => {
        ioRoom.to(roomId).emit("room:info", RoomReadDetailDto.fromRoom(room));
      }, 1000 * time);
    } catch (err) {
      console.log(err);
      return socket.emit("room:err", "Internal Server Error");
    }
  };

  const joinPresent = async function (
    peerId: string,
    media: { audio: boolean; video: boolean }
  ) {
    const socket: Socket = this;
    const roomId = socket.data.roomId;
    const userId = socket.data.userData.userId;
    socket.data.peerId = peerId;

    try {
      const tableIdTemp = socket.data.tableId;
      if (tableIdTemp) {
        socket.leave(tableIdTemp);
      }

      const room = await roomService.findById(roomId);
      if (room.isPresent !== true) return;
      const user = await userService.findUserById(userId);
      ioRoom.to(roomId).emit("present:user-joined", {
        user: UserReadDto.fromUser(user),
        peerId,
        media,
      });
    } catch (err) {
      return socket.emit("room:err", "Internal Server Error");
    }
  };

  const stopPresenting = async function () {
    const socket: Socket = this;
    const roomId = socket.data.roomId;
    const userId = socket.data.userData.userId;

    try {
      const room = await roomService.findById(roomId);
      if (room.isPresent === false) return;

      if (room.owner.toString() !== userId.toString())
        return socket.emit("room:err", "You do not have permission to present");
      //close presenting
      const roomInfo = await roomService.findOneAndUpdatePresent(roomId, false);
      ioRoom.to(roomId).emit("room:info", RoomReadDetailDto.fromRoom(roomInfo));
      ioRoom.to(roomId).emit("present:close");
    } catch (err) {
      return socket.emit("room:err", "Internal Server Error");
    }
  };

  const leaveTable = async function name(peerId: string) {
    const socket: Socket = this;
    const userId = socket.data.userData.userId;
    const roomId = socket.data.roomId;
    const floor = socket.data.floor;

    try {
      const tableIdTemp = socket.data.tableId;
      if (tableIdTemp) {
        socket.leave(tableIdTemp);
        await tableService.removeJoiner(tableIdTemp, userId);
        ioRoom.to(tableIdTemp).emit("table:user-leave", { userId, peerId });

        const tables = await tableService.getTablesByRoomAndFloor(
          roomId,
          floor
        );
        ioRoom.to(floor).emit("floor:tables", {
          tables: TableReadDto.fromArray(tables),
          floor,
        });
      }
    } catch (err) {
      socket.emit("table:err", err);
    }
  };

  const pin = async function name() {
    const socket: Socket = this;
    const userId = socket.data.userData.userId;
    const roomId = socket.data.roomId;
    const peerId = socket.data.peerId;
    ioRoom.to(roomId).emit("present:pin", { userId, peerId });
  };

  const divideTables = async function () {
    const socket: Socket = this;
    const roomId = socket.data.roomId;

    try {
      const tables = await tableService.findAndClearJoiner(roomId);
      ioRoom
        .to(roomId)
        .emit("room:divide-tables", TableReadDto.fromArray(tables));
    } catch {
      return socket.emit("room:err", "Internal Server Error");
    }
  };

  return {
    joinRoom,
    joinFloor,
    leaveRoom,
    leaveTable,
    sendMessage,
    present,
    getMessages,
    sendTableMessage,
    joinTable,
    joinPreviousTable,
    joinPresent,
    stopPresenting,
    changeMedia,
    acceptRequest,
    pin,
    divideTables,
  };
};
