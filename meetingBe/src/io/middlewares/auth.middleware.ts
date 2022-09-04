import dotenv from "dotenv";
import * as jwtService from "../../services/jwt.service";
import { Socket } from "socket.io";
dotenv.config();

const accessTokenSecret = process.env.ACCESS_TOKEN_SECRET;

export default class AuthMiddlesware {
  static verifyToken = async (socket: Socket, next: any) => {
    const token = socket.handshake.auth.token.split(" ")[1];
    try {
      const decoded = await jwtService.verifyToken(token, accessTokenSecret);
      socket.data.userData = decoded;
      next();
    } catch (err) {
      next(new Error("not authoried"));
    }
  };
}
