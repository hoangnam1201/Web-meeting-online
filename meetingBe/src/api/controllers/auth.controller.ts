import UserModel, { User } from "../../models/user.model";
import * as jwtService from "../../services/jwt.service";
import crypto from "crypto-js";
import dotenv from "dotenv";
import { Request, Response } from "express";
import UserService from "../../services/user.service";
import MailService from "../../services/mail.service";

dotenv.config();

const accessTokenSecret = process.env.ACCESS_TOKEN_SECRET;
const accessTokenLife = process.env.ACCESS_TOKEN_LIFE;

export default () => {
  const userService = UserService();
  const mailService = MailService();
  const login = async (req: Request, res: Response) => {
    const username = req.body.username;
    const password = req.body.password;
    try {
      const user = await UserModel.findOne({ username });
      if (!user)
        return res.status(400).json({
          status: 400,
          errors: [
            {
              value: username,
              msg: "invalid username",
              param: "username",
            },
          ],
        });
      if (user.password !== crypto.SHA256(password).toString())
        return res.status(400).json({ err: "invalid password" });
      const userData = {
        userId: user._id,
      };
      const accessToken = await jwtService.generateToken(
        userData,
        accessTokenSecret,
        accessTokenLife
      );
      return res.json({ accessToken });
    } catch (err) {
      console.log(err);
      return res
        .status(500)
        .json({ status: 500, msg: "Internal Server Error" });
    }
  };

  const verifyEmail = async (req: Request, res: Response) => {
    const token = req.query.token;
    if (!token)
      return res.status(401).json({
        msg: "Unauthorizated",
        status: 401,
      });
    try {
      const decoded = await jwtService.verifyToken(
        token as string,
        accessTokenSecret
      );
      await userService.verifyEmail(decoded.userId);
      res.status(200).json({ status: 200, data: null });
    } catch {
      return res
        .status(500)
        .json({ status: 500, msg: "Internal Server Error" });
    }
  };

  const getVerifyMail = async (req: Request, res: Response) => {
    const userId = req.userData.userId;
    try {
      const user = await userService.findUserById(userId);
      if (!user)
        return res.status(400).json({ status: 400, msg: "Not Found User" });
      await mailService.sendConfirmEmail(user.email, user._id);
      res.status(200).json({ status: 200, data: null });
    } catch {
      return res
        .status(500)
        .json({ status: 500, msg: "Internal Server Error" });
    }
  };
  return { login, verifyEmail, getVerifyMail };
};
