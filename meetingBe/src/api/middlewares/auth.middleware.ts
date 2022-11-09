import dotenv from "dotenv";
import { NextFunction, Request, Response } from "express";
import roomModel, { Room } from "../../models/room.model";
import * as jwtService from "../../services/jwt.service";
import RoomService from "../../services/room.service";
import TokenService from "../../services/token.service";
import UserService from "../../services/user.service";

dotenv.config();

const accessTokenSecret = process.env.ACCESS_TOKEN_SECRET;
const refreshTokenSecret = process.env.REFRESH_TOKEN_SECRET;

export default class AuthMiddlesware {
  static userService = UserService();
  static roomService = RoomService();

  static verifyRefreshToken = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    const tokenService = TokenService();
    const { refreshToken } = req.body;
    const token = await tokenService.getByToken(refreshToken);
    if (!token) return res.status(403).json({ status: 403, msg: "Forbidden" });
    try {
      const decoded = await jwtService.verifyToken(
        refreshToken,
        refreshTokenSecret
      );
      req.userData = decoded;
      next();
    } catch (err) {
      return res.status(403).json({ status: 403, msg: "Forbidden" });
    }
  };

  static verifyToken = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    if (!req.headers.authorization) {
      return res.status(401).json({
        msg: "Unauthorizated",
        status: 401,
      });
    }
    const token = req.headers.authorization.split(" ")[1];
    try {
      const decoded = await jwtService.verifyToken(token, accessTokenSecret);
      req.userData = decoded;
      next();
    } catch {
      return res.status(401).json({ status: 401, msg: "Invalid Token" });
    }
  };

  static checkPermisstionCreateRoom = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    const { userId } = req.userData;
    const user = await this.userService.findUserById(userId);
    const { role } = user;
    if (role === "ADMIN") return next();
    // user role
    if (role === "USER")
      return res.status(400).json({
        status: 400,
        msg: "You don't have permisstion to create event",
      });

    //HOST role
    const ownedRooms = await this.roomService.getCountOwnedRooms(userId);
    if (user.maxNoE <= ownedRooms) {
      return res.status(400).json({
        status: 400,
        msg: "The maximum number of events you can create is " + user.maxNoE,
      });
    }
    next();
  };

  static checkAdminPermission = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    const { userId } = req.userData;
    const user = await this.userService.findUserById(userId);
    const { role } = user;
    if (role === "ADMIN") return next();
    return res.status(400).json({
      status: 400,
      msg: "you do not have permission",
    });
  };

  static checkHostPermission = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    const { userId } = req.userData;
    const user = await this.userService.findUserById(userId);
    const { role } = user;
    if (role === "USER")
      return res.status(400).json({
        status: 400,
        msg: "you do not have permission",
      });
    next();
  };

  static checkClassOwnership = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    const roomId = req.params.roomId;
    const userId = req.userData.userId;
    roomModel.findById(roomId, (err: any, room: Room) => {
      if (err) {
        return res
          .status(500)
          .json({ status: 500, msg: "Internal Server Error" });
      }
      if (!room) {
        return res.status(400).json({ status: 400, msg: "not found room" });
      }
      if (room.owner.toString() !== userId.toString()) {
        return res.status(400).json({
          status: 400,
          msg: "you do not have permission",
        });
      }
      next();
    });
  };
}
