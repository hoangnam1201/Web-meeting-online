import { Request, Response } from "express";
import { validationResult } from "express-validator";
import { RoomCreateDto } from "../../Dtos/room-create.dto";
import { RoomReadDetailDto } from "../../Dtos/room-detail.dto";
import { RoomReadDto } from "../../Dtos/room-read.dto";
import { Room } from "../../models/room.model";
import MailService from "../../services/mail.service";
import NotificationService from "../../services/notification.service";
import RoomService from "../../services/room.service";
import UserService from "../../services/user.service";

export default () => {
  const roomService = RoomService();
  const mailService = MailService();
  const userService = UserService();
  const notificationService = NotificationService();

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
        .json({ status: 500, error: "Internal Server Error" });
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
        .json({ status: 500, error: "Internal Server Error" });
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
        .json({ status: 500, error: "Internal Server Error" });
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
        .json({ status: 500, error: "Internal Server Error" });
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
          count: roomData[0].count,
          results: RoomReadDto.fromArray(roomData[0].results),
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
        .json({ status: 500, error: "Internal Server Error" });
    }
  };

  const addMember = async (req: Request, res: Response) => {
    const roomId = req.params.roomId;
    const userId = req.body.userId;
    const authId = req.userData.userId;
    try {
      await roomService.addMember(userId, roomId);
      const notification = await notificationService.createType12N(
        userId,
        notificationService.Type.receiptInvitation,
        authId,
        roomId
      );
      const user = await userService.findUserById(userId);
      if (!user)
        return res.status(400).json({ status: 400, error: "Not Found" });
      await mailService.sendInvitation(roomId, user.email);
      req.app.io.to(userId).emit("notification", notification);
      res.status(200).json({ status: 200, data: null });
    } catch (err) {
      return res
        .status(500)
        .json({ status: 500, error: "Internal Server Error" });
    }
  };

  const addMembers = async (req: Request, res: Response) => {
    const roomId = req.params.roomId;
    const userIds = req.body.userIds;
    const authId = req.userData.userId;
    try {
      await roomService.addMembers(userIds, roomId);
      const users = await userService.getUsersByIds(userIds);
      const ids = users.reduce((total, currentUser) => {
        return total + " " + currentUser.email;
      }, "");
      await mailService.sendInvitation(roomId, ids);
      await Promise.all(
        userIds.map(async (id: string) => {
          const notification = await notificationService.createType12N(
            id,
            notificationService.Type.receiptInvitation,
            authId,
            roomId
          );
          req.app.io.to(id).emit("notification", notification);
        })
      );
      res.status(200).json({ status: 200, data: null });
    } catch (err) {
      return res
        .status(500)
        .json({ status: 500, error: "Internal Server Error" });
    }
  };

  const removeMembers = async (req: Request, res: Response) => {
    const roomId = req.params.roomId;
    const userIds = req.body.userIds;
    const authId = req.userData.userId;
    try {
      await roomService.removeMembers(userIds, roomId);
      const users = await userService.getUsersByIds(userIds);
      const ids = users.reduce((total, currentUser) => {
        return total + " " + currentUser.email;
      }, "");
      await mailService.sendExpulsion(roomId, ids);
      await Promise.all(
        userIds.map(async (id: string) => {
          const notification = await notificationService.createType12N(
            id,
            notificationService.Type.isRemoved,
            authId,
            roomId
          );
          req.app.io.to(id).emit("notification", notification);
        })
      );
      return res.status(200).json({ status: 200, data: null });
    } catch (err) {
      return res
        .status(500)
        .json({ status: 500, error: "Internal Server Error" });
    }
  };

  const removeMember = async (req: Request, res: Response) => {
    const roomId = req.params.roomId;
    const userId = req.query.userId;
    const authId = req.userData.userId;
    try {
      await roomService.removeMember(userId as string, roomId);
      const notification = await notificationService.createType12N(
        userId as string,
        notificationService.Type.isRemoved,
        authId,
        roomId
      );
      const user = await userService.findUserById(userId as string);
      if (!user)
        return res.status(400).json({ status: 400, error: "Not Found" });
      await mailService.sendExpulsion(roomId, user.email);
      req.app.io.to(userId).emit("notification", notification);
      return res.status(200).json({ status: 200, data: null });
    } catch (err) {
      console.log(err);
      return res
        .status(500)
        .json({ status: 500, error: "Internal Server Error" });
    }
  };

  return {
    increaseFloors,
    removeMember,
    removeMembers,
    addMember,
    addMembers,
    createRoom,
    changeRoom,
    getInvitedRoom,
    getOwnedRoom,
    getRoomById,
    deleteRoom,
    deleteFloor,
  };
};
