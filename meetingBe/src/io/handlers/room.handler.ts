import { Socket } from "socket.io";
import { TableReadDto } from "../../Dtos/table-read.dto";
import { MessageReadDto } from "../../Dtos/message-read.dto";
import { RoomReadDetailDto } from "../../Dtos/room-detail.dto";
import { UserReadDetailDto } from "../../Dtos/user-read-detail.dto";
import { Room } from "../../models/room.model";
import { Table } from "../../models/table.model";
import { User } from "../../models/user.model";
import UserService from "../../services/user.service";
import FileService from "../../services/file.service";
import MessageService from "../../services/message.service";
import RoomService from "../../services/room.service";
import TableService from "../../services/table.service";
import { TableDetailDto } from "../../Dtos/table-detail.dto";
import RequestService from "../../services/request.service";

export default (ioRoom: any, io: any) => {
  const userService = UserService();
  const fileService = FileService();
  const roomService = RoomService();
  const tableService = TableService();
  const messageService = MessageService();
  const requestService = RequestService();

  const joinRoom = async function (roomId: string) {
    const socket: Socket = this;
    const userId = socket.data.userData.userId;
    const previousRoomId = socket.data.roomId;
    try {
      const room = await roomService.findById(roomId);
      if (room.state !== "OPENING") {
        return socket.emit("room:join-err", {
          msg: "The room is " + room.state,
          type: "REQUEST",
        });
      }
      const check = await roomService.checkCanAccept(roomId, userId);
      //check previous room
      if (previousRoomId) {
        socket.leave(roomId);
        socket.leave(`${roomId}${userId}`);
      }
      // is class member
      if (check) {
        socket.join(roomId);
        socket.join(`${roomId}${userId}`);
        socket.data.roomId = roomId;

        const room = await roomService.findOneAndAddJoiner(roomId, userId);
        if (!room) return socket.emit("error:bad-request", "not found room");

        socket.emit("room:info", RoomReadDetailDto.fromRoom(room));
        const user = await userService.findUserById(userId);
        ioRoom
          .to(roomId)
          .emit(
            "room:user-joined",
            UserReadDetailDto.fromArrayUser(room.joiners as User[]),
            { userDatas: [user?.name], state: "join" }
          );

        //if is owner host
        if (room.owner.toString() === userId) {
          const requests = await requestService.getRequestInRoom(roomId);
          socket.emit("room:requests", requests);
        }

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

        if (room.isPresent) socket.emit("room:present", { time: 1, tables });

        const messages = await messageService.getMessages(roomId, 30, 0);
        socket.emit("room:messages", MessageReadDto.fromArray(messages));
        return;
      }

      //not a class member
      socket.emit("room:join-err", {
        msg: "You are not a class member, Please wait for the room owner to accept",
        type: "REQUEST",
      });

      const request = await requestService.createRequest({
        roomId,
        user: userId,
        socketId: socket.id,
      });
      const user = await userService.findUserById(userId);
      if (user)
        ioRoom
          .to(`${roomId}${room.owner.toString()}`)
          .emit("room:user-request", request);
    } catch (err) {
      socket.emit("room:err", { err });
    }
  };

  const kickUser = async function (
    memberId: string,
    isRemoveMember: boolean = false
  ) {
    const socket: Socket = this;
    const userId = socket.data.userData.userId;
    const roomId = socket.data.roomId;
    try {
      const checkRoom = await roomService.findById(roomId);
      if (checkRoom.owner.toString() !== userId.toString())
        return socket.emit("room:err", "You do not have permission to present");
      const ids = await ioRoom.in(memberId).allSockets();
      if (isRemoveMember) {
        await roomService.removeMember(memberId, roomId);
      }
      for (const id of ids) {
        const socketTemp = ioRoom.sockets.get(id);
        if (socketTemp.rooms.has(roomId)) {
          socketTemp.emit(
            "room:disconnect-reason",
            "You are kicked out of room"
          );
          socketTemp.disconnect();
        }
      }
    } catch {
      socket.emit("room:err", "Internal Server Error");
    }
  };

  const buzzUser = async function (memberId: string, text: string) {
    const socket: Socket = this;
    const roomId = socket.data.roomId;
    const userId = socket.data.userData.userId;
    try {
      const checkRoom = await roomService.findById(roomId);
      if (checkRoom.owner.toString() !== userId.toString())
        return socket.emit("room:err", "You do not have permission to present");
      socket.to(`${roomId}${memberId}`).emit("room:buzz", text);
    } catch {
      socket.emit("room:err", "Internal Server Error");
    }
  };

  const closeRoom = async function (callback: () => void) {
    const socket: Socket = this;
    const roomId = socket.data.roomId;
    const userId = socket.data.userData.userId;
    const checkRoom = await roomService.findById(roomId);
    if (checkRoom.owner.toString() !== userId.toString())
      return socket.emit(
        "room:err",
        "You do not have permission to close room"
      );
    await roomService.changeStateRoom(roomId, "CLOSING");
    await roomService.removeAllJoiners(roomId);
    socket.broadcast
      .to(roomId)
      .emit("room:disconnect-reason", "The room is closed");
    socket.broadcast.to(roomId).disconnectSockets(true);
    callback && callback();
  };

  const acceptRequest = async function (requestIds: string[], accept: string) {
    const socket: Socket = this;

    const roomId = socket.data.roomId;
    const requests = await requestService.getByIds(requestIds);
    const socketIds = requests.map((r) => r.socketId);
    const userIds = requests.map((r) => r.user.toString());

    //response requests
    await requestService.deleteRequests(requestIds);
    const requestsNew = await requestService.getRequestInRoom(roomId);
    socket.emit("room:requests", requestsNew);

    if (!accept)
      return socket.to(socketIds).emit("room:join-err", {
        msg: "Your request has been declined",
        type: "REFUSE",
      });

    try {
      const room: Room = await roomService.findOneAndAddJoiners(
        roomId,
        userIds
      );

      if (!room) return socket.emit("error:bad-request", "not found room");

      const clientSockets = await socket.in(socketIds).fetchSockets();
      for (const s of clientSockets) {
        const userId = requests.find((x) => x.socketId === s.id).user;
        s.join(roomId);
        s.join(`${roomId}${userId}`);
        s.data.roomId = roomId;
      }

      socket.to(socketIds).emit("room:info", RoomReadDetailDto.fromRoom(room));
      const users = await userService.getUsersByIds(userIds);
      ioRoom
        .to(roomId)
        .emit(
          "room:user-joined",
          UserReadDetailDto.fromArrayUser(room.joiners as User[]),
          { userDatas: users.map((u) => u?.name), state: "join" }
        );

      //join first floor
      let tables: Table[] = [];
      if (room.floors.length > 0) {
        tables = await tableService.getTablesByRoomAndFloor(
          roomId,
          room.floors[0]
        );
        socket.to(socketIds).emit("floor:tables", {
          tables: TableReadDto.fromArray(tables),
          floor: room.floors[0],
        });
        for (const s of clientSockets) {
          s.join(room.floors[0].toString());
          s.data.floor = room.floors[0].toString();
        }
      }

      if (room.isPresent)
        socket.to(socketIds).emit("room:present", { time: 1, tables });

      const messages = await messageService.getMessages(roomId, 20, 0);
      socket
        .to(socketIds)
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
      const user = await userService.findUserById(userId);
      if (!room) return socket.emit("room:bad-request", "not found room");
      socket.to(roomId).emit("room:user-joined", room.joiners, {
        userDatas: [user.name],
        state: "leave",
      });

      if (room.isPresent) {
        //stop presenting if user is owner
        if (room.owner.toString() === userId.toString()) {
          const roomInfo = await roomService.findOneAndUpdatePresent(
            roomId,
            false
          );
          socket
            .to(roomId)
            .emit("room:info", RoomReadDetailDto.fromRoom(roomInfo));
          socket.to(roomId).emit("present:close");
        }
        socket.to(roomId).emit("present:user-leave", { userId, peerId });
        return;
      }
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
        socket.to(tableId).emit("table:user-leave", { userId, peerId });
      }
    } catch (err) {
      socket.emit("room:err", err);
    }
  };

  const sendMessage = async function (
    data: { files: [{ data: Buffer; name: string }]; msgString: string },
    callBack: (isSuccess: boolean) => void
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
      callBack && callBack(true);
    } catch {
      callBack && callBack(false);
    }
  };

  const sendTableMessage = async function (
    data: {
      files: [{ data: Buffer; name: string }];
      msgString: string;
    },
    callBack: (isSuccess: boolean) => void
  ) {
    const socket = this;
    const userId = socket.data.userData.userId;
    const tableId = socket.data.tableId;
    const sender = await userService.findUserById(userId);

    const message = {
      sender: UserReadDetailDto.fromUser(sender),
      files: data.files,
      message: data.msgString,
      createAt: new Date(),
    };
    ioRoom.to(tableId).emit("table:message", message);
    callBack && callBack(true);
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
    location: { tableId: string; floor: string },
    peerId: string,
    media: { audio: boolean; video: boolean },
    callback: (isSuccess: boolean) => void
  ) {
    const socket: Socket = this;
    const userId = socket.data.userData.userId;
    const roomId = socket.data.roomId;
    const currentFloor = socket.data.floor;
    const { tableId, floor } = location;

    try {
      //check full table
      const table: Table = await tableService.getById(tableId);
      if (table.numberOfSeat <= table.users.length) {
        socket.emit("table:join-err", "the table is full");
        return;
      }

      // check previous tables
      const previousTableId = socket.data.tableId;
      checkPrevious: if (previousTableId) {
        ioRoom.to(previousTableId).emit("table:user-leave", { userId, peerId });
        socket.leave(previousTableId);
        const table = await tableService.removeJoiner(previousTableId, userId);
        const previousFloor = table.floor.toString();
        if (floor === previousFloor) break checkPrevious;
        if (!floor && previousFloor === currentFloor) break checkPrevious;
        const tables = await tableService.getTablesByRoomAndFloor(
          roomId,
          previousFloor
        );
        ioRoom.to(previousFloor).emit("floor:tables", {
          tables: TableReadDto.fromArray(tables),
          floor: previousFloor,
        });
      }
      //join new table
      await tableService.addJoiner(roomId, tableId, userId);

      //join new floor
      if (floor) {
        socket.leave(currentFloor);
        socket.join(floor);
        socket.data.floor = floor;
      }
      const floorTemp = floor ? floor : currentFloor;
      const tables = await tableService.getTablesByRoomAndFloor(
        roomId,
        floorTemp
      );
      ioRoom.to(floorTemp).emit("floor:tables", {
        tables: TableReadDto.fromArray(tables),
        floor: floorTemp,
      });

      const user = await userService.findUserById(userId);
      ioRoom.to(tableId).emit("table:user-joined", {
        user: UserReadDetailDto.fromUser(user),
        peerId,
        media,
      });

      callback && callback(true);
      socket.join(tableId);
      socket.data.tableId = tableId;
      socket.data.peerId = peerId;
    } catch (err) {
      callback && callback(false);
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
        user: UserReadDetailDto.fromUser(user),
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
    if (previousFloor) socket.leave(previousFloor);
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
      if (checkRoom.owner.toString() !== userId.toSting())
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
        user: UserReadDetailDto.fromUser(user),
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

  const leaveTable = async function (peerId: string) {
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
        .emit("room:divide-tables", TableDetailDto.fromArray(tables));
    } catch {
      console.log("error");
      return socket.emit("room:err", "Internal Server Error");
    }
  };

  return {
    buzzUser,
    kickUser,
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
    closeRoom,
    changeMedia,
    acceptRequest,
    pin,
    divideTables,
  };
};
