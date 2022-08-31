import dotenv from "dotenv";
import * as jwtService from "../../services/jwt.service";
import { Socket } from "socket.io";
import { OAuth2Client } from "google-auth-library";
import userModel from "../../models/user.model";
dotenv.config();

const accessTokenSecret = process.env.ACCESS_TOKEN_SECRET;
const clientId = process.env.CLIENT_ID;
const client = new OAuth2Client(clientId);

export default class AuthMiddlesware {
  static verifyToken = async (socket: Socket, next: any) => {
    const token = socket.handshake.auth.token.split(" ")[1];
    try {
      const decoded = await jwtService.verifyToken(token, accessTokenSecret);
      socket.data.userData = decoded;
      next();
    } catch (err) {
      try {
        const toket = await client.verifyIdToken({
          idToken: token,
          audience: clientId,
        });
        const payload = toket.getPayload();
        const user = await userModel.findOne({ email: payload.email });
        socket.data.userData = { userId: user._id };
        next();
      } catch (err) {
        next(new Error("not authoried"));
      }
    }
  };
}
