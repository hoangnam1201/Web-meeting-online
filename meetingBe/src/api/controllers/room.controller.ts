import { Request, Response } from "express";
import { validationResult } from "express-validator";
import { RoomCreateDto } from "../../Dtos/room-create.dto";
import { RoomReadDetailDto } from "../../Dtos/room-detail.dto";
import { RoomReadDto } from "../../Dtos/room-read.dto";
import { UserReadDto } from "../../Dtos/user-read.dto";
import { FileRequest } from "../../interfaces/fileRequest";
import { Room } from "../../models/room.model";
import { User } from "../../models/user.model";
import FileService from "../../services/file.service";
import MailService from "../../services/mail.service";
import QueueService from "../../services/queue.service";
import RoomService from "../../services/room.service";
import UserService from "../../services/user.service";

export default () => {
  const roomService = RoomService();
  const mailService = MailService();
  const userService = UserService();
  const fileService = FileService();
  const queueService = QueueService();

  const createRoom = async (req: Request, res: Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ status: 400, errors: errors.array() });
    }

    const userId = req.userData.userId;
    const room: Room = { ...req.body, owner: userId };
    const roomCreate = RoomCreateDto.fromRoom(room);
    try {
      await roomService.create(roomCreate);
      return res.status(200).json({ status: 200, data: null });
    } catch (err) {
      return res.status(500).json({
        status: 500,
        msg: "Internal Server Error",
      });
    }
  };

  const deleteRoom = async (req: Request, res: Response) => {
    const roomId = req.params.roomId;
    try {
      await roomService.deleteRoom(roomId);
      return res.status(200).json({ status: 200, data: null });
    } catch (err) {
      return res.status(500).json({
        status: 500,
        msg: "Internal Server Error",
      });
    }
  };

  const downloadJoiners = async (req: Request, res: Response) => {
    const roomId = req.params.roomId;
    try {
      const joiners = await roomService.getJoiners(roomId);
      const membersReadDto = UserReadDto.fromArrayUser(joiners as User[]);
      const stream = fileService.jsonToExcel(membersReadDto, []);
      //response
      res.setHeader(
        "Content-disposition",
        "attachment; filename=" + `members-${roomId}.xlsx`
      );
      res.setHeader(
        "Content-type",
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
      );

      stream.pipe(res);
    } catch (err) {
      return res.status(500).json({
        status: 500,
        msg: "Internal Server Error",
      });
    }
  };

  const getRooms = async (req: Request, res: Response) => {
    const { ownerId, take = 10, page = 0 } = req.query;
    try {
      const roomData = await roomService.getRooms(
        ownerId && ownerId.toString(),
        parseInt(take as string),
        parseInt(page as string)
      );
      return res.status(200).json({
        status: 200,
        data: {
          count: roomData[0].count || 0,
          records: RoomReadDto.fromArray(roomData[0].records),
        },
      });
    } catch (err) {
      console.log(err);
      return res.status(500).json({
        status: 500,
        msg: "Internal Server Error",
      });
    }
  };

  const changeStateRoom = async (req: Request, res: Response) => {
    const roomId = req.params.roomId;
    const { state } = req.body;
    try {
      if (state !== "OPENING" && state !== "CLOSING")
        return res
          .status(400)
          .json({ status: 400, msg: "State is 'CLOSING' or 'OPENING'" });
      const room = await roomService.findById(roomId);
      if (!room) return res.status(400).json({ status: 400, msg: "not found" });
      if (room.state === "BANNING")
        return res
          .status(400)
          .json({ status: 400, msg: "this room is banning" });

      await roomService.changeStateRoom(roomId, state);
      return res.status(200).json({ status: 200, data: null });
    } catch (err) {
      return res
        .status(500)
        .json({ status: 500, msg: "Internal Server Error" });
    }
  };

  const BanRoom = async (req: Request, res: Response) => {
    const roomId = req.params.roomId;
    try {
      await roomService.changeStateRoom(roomId, "BANNING");
      return res.status(200).json({ status: 200, data: null });
    } catch (err) {
      return res
        .status(500)
        .json({ status: 500, msg: "Internal Server Error" });
    }
  };

  const UnbanRoom = async (req: Request, res: Response) => {
    const roomId = req.params.roomId;
    try {
      await roomService.changeStateRoom(roomId, "OPENING");
      return res.status(200).json({ status: 200, data: null });
    } catch (err) {
      return res
        .status(500)
        .json({ status: 500, msg: "Internal Server Error" });
    }
  };

  const changeRoom = async (req: Request, res: Response) => {
    const roomId = req.params.roomId;
    const room = req.body;
    const roomChange = RoomCreateDto.fromRoom(room);
    try {
      await roomService.changeRoomInfo(roomId, roomChange);
      return res.status(200).json({ status: 200, data: null });
    } catch (err) {
      return res
        .status(500)
        .json({ status: 500, msg: "Internal Server Error" });
    }
  };

  const increaseFloors = async (req: Request, res: Response) => {
    const roomId = req.params.roomId;
    try {
      await roomService.inscreaseFloors(roomId);
      return res.status(200).json({ status: 200, data: null });
    } catch (err) {
      console.log(err);
      return res
        .status(500)
        .json({ status: 500, msg: "Internal Server Error" });
    }
  };

  const deleteFloor = async (req: Request, res: Response) => {
    const roomId = req.params.roomId;
    const { floor } = req.query;
    try {
      await roomService.deleteFloor(roomId, floor.toString());
      return res.status(200).json({ status: 200, data: null });
    } catch (err) {
      console.log(err);
      return res
        .status(500)
        .json({ status: 500, msg: "Internal Server Error" });
    }
  };

  const getRoomById = async (req: Request, res: Response) => {
    const roomId = req.params.roomId;
    try {
      const room = await roomService.getDetail(roomId);
      if (!room) return res.status(400).json({ status: 400, msg: "Not Found" });
      const roomDetail = RoomReadDetailDto.fromRoom(room);
      return res.status(200).json({ status: 200, data: roomDetail });
    } catch (err) {
      console.log(err);
      return res
        .status(500)
        .json({ status: 500, msg: "Internal Server Error" });
    }
  };

  const getOwnedRoom = async (req: Request, res: Response) => {
    const userId = req.userData.userId;
    try {
      const { pageIndex, pageSize } = req.query;
      if (!pageIndex && !pageSize) {
        const rooms = await roomService.getOwnedRooms(userId);
        const roomReads = RoomReadDto.fromArray(rooms);
        return res.status(200).json({ status: 200, data: roomReads });
      }
      const index = parseInt(pageIndex as string, 10) || 0;
      const take = parseInt(pageSize as string, 10) || 10;

      const roomData = await roomService.getPageDataOwnedRooms(
        userId,
        take,
        index
      );
      return res.status(200).json({
        status: 200,
        data: {
          count: roomData[0].count || 0,
          records: RoomReadDto.fromArray(roomData[0].records),
        },
      });
    } catch (err) {
      return res
        .status(500)
        .json({ status: 500, msg: "Internal Server Error" });
    }
  };

  const getInvitedRoom = async (req: Request, res: Response) => {
    const userId = req.userData.userId;
    try {
      const { pageIndex, pageSize } = req.query;
      if (!pageIndex && !pageSize) {
        const rooms = await roomService.getInvitedRoom(userId);
        const roomReads = RoomReadDto.fromArray(rooms as Room[]);
        return res.status(200).json({ status: 200, data: roomReads });
      }
      const index = parseInt(pageIndex as string, 10) || 0;
      const take = parseInt(pageSize as string, 10) || 10;

      const roomData = await roomService.getPageDataInvitedRooms(
        userId,
        take,
        index
      );
      return res.status(200).json({
        status: 200,
        data: roomData,
      });
    } catch (err) {
      return res
        .status(500)
        .json({ status: 500, msg: "Internal Server Error" });
    }
  };

  const addMember = async (req: Request, res: Response) => {
    const roomId = req.params.roomId;
    const userId = req.body.userId;
    try {
      await roomService.addMember(userId, roomId);
      const user = await userService.findUserById(userId);
      if (!user) return res.status(400).json({ status: 400, msg: "Not Found" });
      await mailService.sendInvitation(roomId, user.email);
      res.status(200).json({ status: 200, data: null });
    } catch (err) {
      return res
        .status(500)
        .json({ status: 500, msg: "Internal Server Error" });
    }
  };

  const addMembers = async (req: Request, res: Response) => {
    const roomId = req.params.roomId;
    const userIds = req.body.userIds;
    try {
      await roomService.addMembers(userIds, roomId);
      const users = await userService.getUsersByIds(userIds);
      const ids = users.reduce((total, currentUser) => {
        return total + " " + currentUser.email;
      }, "");
      await mailService.sendInvitation(roomId, ids);
      res.status(200).json({ status: 200, data: null });
    } catch (err) {
      return res
        .status(500)
        .json({ status: 500, msg: "Internal Server Error" });
    }
  };

  const removeMembers = async (req: Request, res: Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ status: 400, msg: errors.array()[0] });
    }

    const roomId = req.params.roomId;
    const userIds = req.body.userIds;
    try {
      await roomService.removeMembers(userIds, roomId);
      const users = await userService.getUsersByIds(userIds);
      const ids = users.reduce((total, currentUser) => {
        return total + " " + currentUser.email;
      }, "");
      await mailService.sendExpulsion(roomId, ids);
      return res.status(200).json({ status: 200, data: null });
    } catch (err) {
      console.log(err);
      return res
        .status(500)
        .json({ status: 500, msg: "Internal Server Error" });
    }
  };

  const addMembersByFile = async (req: FileRequest, res: Response) => {
    const roomId = req.params.roomId;
    const file = req.files?.importFile;

    try {
      //remove old members
      await roomService.removeAllMembers(roomId);
      await queueService.deleteQueuesByRoomId(roomId);
      //convert file => json
      const emails = fileService
        .excelToJson(file.data)
        .map((u: { Email: string; email: string }) =>
          u.Email ? u.Email : u.email
        );
      const users = await userService.findUserByEmails(emails);
      //add new members
      await roomService.addMembers(
        users.map((u) => u._id),
        roomId
      );

      // create new queue
      //users don't exits in db
      const queueEmails = emails.filter(
        (e) => users.findIndex((u) => u.email === e) === -1
      );
      await queueService.createQueues(queueEmails, roomId);

      //send mail
      const emailString = emails.reduce((total, email) => {
        if (total) return total + ", " + email;
        return email;
      }, "");
      console.log("a", emailString);
      if (emailString) await mailService.sendInvitation(roomId, emailString);
      //res
      res.status(200).json({ status: 200, data: null });
    } catch (e) {
      console.log(e);
      return res
        .status(500)
        .json({ status: 500, msg: "Internal Server Error" });
    }
  };

  const removeMember = async (req: Request, res: Response) => {
    const roomId = req.params.roomId;
    const userId = req.query.userId;
    try {
      await roomService.removeMember(userId as string, roomId);
      const user = await userService.findUserById(userId as string);
      if (!user) return res.status(400).json({ status: 400, msg: "Not Found" });
      await mailService.sendExpulsion(roomId, user.email);
      return res.status(200).json({ status: 200, data: null });
    } catch (err) {
      console.log(err);
      return res
        .status(500)
        .json({ status: 500, msg: "Internal Server Error" });
    }
  };

  const exportToCSV = async (req: Request, res: Response) => {
    const roomId = req.params.roomId;
    try {
      const room = await roomService.getDetail(roomId);
      const membersReadDto = UserReadDto.fromArrayUser(room.members as User[]);
      const stream = fileService.jsonToExcel(membersReadDto, []);
      //response
      res.setHeader(
        "Content-disposition",
        "attachment; filename=" + `members-${roomId}.xlsx`
      );
      res.setHeader(
        "Content-type",
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
      );

      stream.pipe(res);
    } catch {
      return res
        .status(500)
        .json({ status: 500, msg: "Internal Server Error" });
    }
  };

  return {
    increaseFloors,
    removeMember,
    removeMembers,
    addMember,
    addMembers,
    addMembersByFile,
    createRoom,
    changeRoom,
    changeStateRoom,
    BanRoom,
    UnbanRoom,
    getInvitedRoom,
    getOwnedRoom,
    getRoomById,
    getRooms,
    deleteRoom,
    deleteFloor,
    exportToCSV,
    downloadJoiners,
  };
};
