import dotenv from "dotenv";
import { NextFunction, Request, Response } from "express";
import roomModel, { Room } from "../../models/room.model";
import * as jwtService from "../../services/jwt.service";
import { OAuth2Client } from "google-auth-library";
import userModel from "../../models/user.model";

dotenv.config();

const accessTokenSecret = process.env.ACCESS_TOKEN_SECRET;
const clientId = process.env.CLIENT_ID;
const client = new OAuth2Client(clientId);

export default class AuthMiddlesware {
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
    } catch (err) {
      //check google token
      try {
      const tiket = await client.verifyIdToken({
        idToken: token,
        audience: clientId,
      });
      const payload = tiket.getPayload();
      console.log(payload);
      const user = await userModel.findOne({ email: payload.email });
      if (user) {
        req.userData = { userId: user._id };
        next();
      } else {
        const user = new userModel({
          name: payload.name,
          email: payload.email,
          picture: payload.picture,
        });
        await user.save();
        req.userData = { userId: user._id };
        next();
      }
      } catch (err) {
        return res.status(401).json({ status: 401, msg: "Invalid Token" });
      }
    }
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
      if (room.owner.toString() !== userId) {
        return res.status(400).json({
          status: 400,
          errors: [{ msg: "you do not have permission" }],
        });
      }
      next();
    });
  };
}
