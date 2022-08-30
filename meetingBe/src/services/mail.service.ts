import dotenv from "dotenv";
import nodemailer from "nodemailer";
import { User } from "../models/user.model";
import { generateToken } from "./jwt.service";
import RoomService from "./room.service";

dotenv.config();
const user = process.env.USER_EMAIL;
const pass = process.env.PASSWORD_EMAIL;
const server_host = process.env.HOST_SERVER;
const server_frontend = process.env.HOST_FRONTEND;
const accessTokenSecret = process.env.ACCESS_TOKEN_SECRET;
const accessTokenLife = process.env.ACCESS_TOKEN_LIFE;

export default () => {
  const roomService = RoomService();

  const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false,
    auth: {
      user: user,
      pass: pass,
    },
  });

  const sendConfirmEmail = async (emails: string, userId: string) => {
    const accessToken = await generateToken(
      { userId: userId },
      accessTokenSecret,
      accessTokenLife
    );
    return await transporter.sendMail({
      from: `utemeeting <${user}>`,
      to: emails, // list of receivers
      subject: "Sign Up Success", // Subject line
      html: `    <table style="width:100%; background-color: #d1d5db; padding: 10px;">
      <tr style="border-radius: 5px; border: 0">
          <td style="width: auto"></td>
          <td colspan="2"
              style="width:45%; background-color: #f3f4f6; border: 0; padding: 10px 30px; border-radius: 5px;">
              <p style="text-align: center; font-size: larger; ">
                  Sign Up Success ✔️
              </p>
              <p style="font-size:larger;">Home page:
                  <a href="${server_frontend}" style="text-decoration: none;">utemeeting</a>
              </p>
              <p style="font-size:larger;">Thanks
                  for registering,
                  click here
                  to comfirm email:</p>
              <table style="width: 100%;">
                  <tr>
                      <td style="width:auto"></td>
                      <td colspan="2" style="width: 30%;">
                          <a href="${server_host}/api/auth/verify?token=${accessToken}"
                              style="display: block;text-align: center; background-color: gray; color: white; border-radius: 3px;padding: 3px;text-decoration: none;">comfirm
                              email</a>
                      </td>
                      <td style="width:auto"></td>
                  </tr>
              </table>
          <td style="width: auto"></td>
          </td>
      </tr>
  </table>`, // html body
    });
  };

  const sendExpulsion = async (roomId: string, emails: string) => {
    const room = await roomService.getDetail(roomId);
    return await transporter.sendMail({
      from: `utemeeting <${user}>`,
      to: emails, // list of receivers
      subject: "Member Expulsion", // Subject line
      html: `    <table style="width:100%; background-color: #d1d5db; padding: 10px;">
      <tr style="border-radius: 5px; border: 0">
          <td style="width: auto"></td>
          <td colspan="2"
              style="width:45%; background-color: #f3f4f6; border: 0; padding: 10px 30px; border-radius: 5px;">
              <p style="text-align: center; font-size: larger; color:#dc2626">
              Explusion
              </p>
              <p style="font-size:larger;">Home page:
                  <a href="${server_frontend}" style="text-decoration: none;">utemeeting</a>
              </p>
              <p style="font-size:larger;">Room owner: ${
                (room.owner as User)?.name
              }</p>
              <p style="font-size:larger;">Room name: ${room.name}</p>
              <b style="font-size:larger;">You are no longer a room member of this room</b>
          <td style="width: auto"></td>
          </td>
      </tr>
  </table>`, // html body
    });
  };

  const sendInvitation = async (roomId: string, emails: string) => {
    const room = await roomService.getDetail(roomId);
    return await transporter.sendMail({
      from: `utemeeting <${user}>`,
      to: emails, // list of receivers
      subject: "Member Invitation", // Subject line
      html: `    <table style="width:100%; background-color: #d1d5db; padding: 10px;">
      <tr style="border-radius: 5px; border: 0">
          <td style="width: auto"></td>
          <td colspan="2"
              style="width:45%; background-color: #f3f4f6; border: 0; padding: 10px 30px; border-radius: 5px;">
              <p style="text-align: center; font-size: larger; ">
                  Invitation
              </p>
              <p style="font-size:larger;">Home page:
                  <a href="${server_frontend}" style="text-decoration: none;">utemeeting</a>
              </p>
              <p style="font-size:larger;">Room owner: ${
                (room.owner as User)?.name
              }</p>
              <p style="font-size:larger;">Room name: ${room.name}</p>
              <p style="font-size:larger;">Room description: ${
                room.description
              }</p>
              <p style="font-size:larger;">you have become a member in this room and you can join the room</p>
              <table style="width: 100%;">
                  <tr>
                      <td style="width:auto"></td>
                      <td colspan="2" style="width: 30%;">
                          <a href="${server_frontend}/room/${roomId}"
                              style="display: block;text-align: center; background-color: gray; color: white; border-radius: 3px;padding: 3px;text-decoration: none;">
                              join</a>
                      </td>
                      <td style="width:auto"></td>
                  </tr>
              </table>
          <td style="width: auto"></td>
          </td>
      </tr>
  </table>`, // html body
    });
  };

  return { sendConfirmEmail, sendInvitation, sendExpulsion };
};
