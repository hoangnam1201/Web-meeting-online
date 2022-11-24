import UserModel, { User } from "../../models/user.model";
import * as jwtService from "../../services/jwt.service";
import crypto from "crypto-js";
import dotenv from "dotenv";
import { Request, Response } from "express";
import UserService from "../../services/user.service";
import MailService from "../../services/mail.service";
import TokenService from "../../services/token.service";
import userModel from "../../models/user.model";
import { OAuth2Client } from "google-auth-library";
import { UserCreateDto } from "../../Dtos/user-create.dto";

dotenv.config();

const accessTokenSecret = process.env.ACCESS_TOKEN_SECRET;
const accessTokenLife = process.env.ACCESS_TOKEN_LIFE;
const refreshTokenSecret = process.env.REFRESH_TOKEN_SECRET;
const refreshTokenLife = process.env.REFRESH_TOKEN_LIFE;
const clientId = process.env.CLIENT_ID;
const client = new OAuth2Client(clientId);

export default () => {
  const userService = UserService();
  const mailService = MailService();
  const tokenService = TokenService();

  const getToken = async (req: Request, res: Response) => {
    try {
      const accessToken = await jwtService.generateToken(
        { userId: req.userData.userId },
        accessTokenSecret,
        accessTokenLife
      );
      res.status(200).json({ status: 200, data: accessToken });
    } catch {
      res.status(500).json({ status: 500, msg: "Internal Server Error" });
    }
  };

  const revoke = async (req: Request, res: Response) => {
    const { refreshToken } = req.body;
    try {
      await tokenService.remove(refreshToken);
      res.status(200).json({ status: 200, data: null });
    } catch {
      res.status(500).json({ status: 500, msg: "Internal Server Error" });
    }
  };

  const googleLogin = async (req: Request, res: Response) => {
    const { token } = req.body;
    try {
      const tiket = await client.verifyIdToken({
        idToken: token,
        audience: clientId,
      });
      const payload = tiket.getPayload();
      const user = await userService.findUserByEmail(payload.email);
      if (user) {
        const accessToken = await jwtService.generateToken(
          { userId: user._id },
          accessTokenSecret,
          accessTokenLife
        );
        const refreshToken = await jwtService.generateToken(
          { userId: user._id },
          refreshTokenSecret,
          refreshTokenLife
        );
        await tokenService.create(refreshToken, user._id);
        return res.json({ accessToken, refreshToken });
      } else {
        // const user = new userModel({
        //   name: payload.name,
        //   email: payload.email,
        //   picture: payload.picture,
        // });
        // await user.save();
        const userCreate = UserCreateDto.fromGmailUser({
          name: payload.name,
          email: payload.email,
          picture: payload.picture,
        });
        const user = await userService.create(userCreate);
        const accessToken = await jwtService.generateToken(
          { userId: user._id },
          accessTokenSecret,
          accessTokenLife
        );
        const refreshToken = await jwtService.generateToken(
          { userId: user._id },
          refreshTokenSecret,
          refreshTokenLife
        );
        await tokenService.create(refreshToken, user._id);
        return res.json({ accessToken, refreshToken });
      }
    } catch (err) {
      return res.status(401).json({ status: 401, msg: "Invalid Token" });
    }
  };

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
        role: user.role,
      };
      const accessToken = await jwtService.generateToken(
        userData,
        accessTokenSecret,
        accessTokenLife
      );
      const refreshToken = await jwtService.generateToken(
        userData,
        refreshTokenSecret,
        refreshTokenLife
      );
      await tokenService.create(refreshToken, user._id);

      return res.json({ accessToken, refreshToken });
    } catch (err) {
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
  return { login, verifyEmail, getVerifyMail, getToken, revoke, googleLogin };
};
