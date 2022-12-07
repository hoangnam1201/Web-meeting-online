import { Router } from "express";
import { body, param, query } from "express-validator";
import RoomController from "../controllers/room.controller";
import AuthMiddlesware from "../middlewares/auth.middleware";
import { checkXLSXFile } from "../middlewares/checkXLSXFile.middeware";
import {
  changeRoomValidator,
  createRoomValidator,
} from "../validations/room.validator";

const roomRoute = Router();
const roomController = RoomController();

roomRoute.post(
  "",
  [
    AuthMiddlesware.verifyToken,
    AuthMiddlesware.checkPermisstionCreateRoom,
    ...createRoomValidator(),
  ],
  roomController.createRoom
);

roomRoute.get(
  "",
  [AuthMiddlesware.verifyToken, AuthMiddlesware.checkAdminPermission],
  roomController.getRooms
);

roomRoute.put(
  "/ban-room/:roomId",
  [AuthMiddlesware.verifyToken, AuthMiddlesware.checkAdminPermission],
  roomController.BanRoom
);

roomRoute.put(
  "/unban-room/:roomId",
  [AuthMiddlesware.verifyToken, AuthMiddlesware.checkAdminPermission],
  roomController.UnbanRoom
);

roomRoute.delete(
  "/:roomId",
  [AuthMiddlesware.verifyToken, AuthMiddlesware.checkClassOwnership],
  roomController.deleteRoom
);

roomRoute.put(
  "/:roomId",
  [
    AuthMiddlesware.verifyToken,
    AuthMiddlesware.checkClassOwnership,
    ...changeRoomValidator(),
  ],
  roomController.changeRoom
);

roomRoute.put(
  "/state/:roomId",
  [
    AuthMiddlesware.verifyToken,
    AuthMiddlesware.checkClassOwnership,
    ...changeRoomValidator(),
  ],
  roomController.changeStateRoom
);

roomRoute.get(
  "/owned-room",
  AuthMiddlesware.verifyToken,
  roomController.getOwnedRoom
);

roomRoute.get(
  "/invited-room",
  AuthMiddlesware.verifyToken,
  roomController.getInvitedRoom
);

roomRoute.get(
  "/:roomId",
  AuthMiddlesware.verifyToken,
  roomController.getRoomById
);

roomRoute.post(
  "/members/add-member/:roomId",
  [
    AuthMiddlesware.verifyToken,
    AuthMiddlesware.checkClassOwnership,
    body("userId", "invalid userId").exists().isString(),
  ],
  roomController.addMember
);

roomRoute.delete(
  "/members/remove-member/:roomId",
  [
    AuthMiddlesware.verifyToken,
    AuthMiddlesware.checkClassOwnership,
    body("userId", "invalid userId").exists().isString(),
  ],
  roomController.removeMember
);

roomRoute.post(
  "/members/add-members-by-file/:roomId",
  [
    AuthMiddlesware.verifyToken,
    AuthMiddlesware.checkClassOwnership,
    checkXLSXFile,
  ],
  roomController.addMembersByFile
);

roomRoute.post(
  "/members/add-members/:roomId",
  [
    AuthMiddlesware.verifyToken,
    AuthMiddlesware.checkClassOwnership,
    body("userIds", "invalid userId").exists().isArray(),
  ],
  roomController.addMembers
);

roomRoute.post(
  "/members/remove-members/:roomId",
  [
    AuthMiddlesware.verifyToken,
    AuthMiddlesware.checkClassOwnership,
    body("userIds", "invalid userId").exists().isArray(),
  ],
  roomController.removeMembers
);

roomRoute.get("/members/download-csv/:roomId", roomController.exportToCSV);

roomRoute.get("/joiners/download/:roomId", roomController.downloadJoiners);

roomRoute.post(
  "/floors/:roomId",
  [AuthMiddlesware.verifyToken, AuthMiddlesware.checkClassOwnership],
  roomController.increaseFloors
);

roomRoute.delete(
  "/floors/:roomId",
  [
    AuthMiddlesware.verifyToken,
    AuthMiddlesware.checkClassOwnership,
    query("floor", "invalid floor").exists().isString(),
  ],
  roomController.deleteFloor
);

export default roomRoute;
