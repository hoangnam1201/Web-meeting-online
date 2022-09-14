"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
const nodemailer_1 = __importDefault(require("nodemailer"));
const jwt_service_1 = require("./jwt.service");
const room_service_1 = __importDefault(require("./room.service"));
dotenv_1.default.config();
const user = process.env.USER_EMAIL;
const pass = process.env.PASSWORD_EMAIL;
const server_host = process.env.HOST_SERVER;
const server_frontend = process.env.HOST_FRONTEND;
const accessTokenSecret = process.env.ACCESS_TOKEN_SECRET;
const accessTokenLife = process.env.ACCESS_TOKEN_LIFE;
exports.default = () => {
    const roomService = (0, room_service_1.default)();
    const transporter = nodemailer_1.default.createTransport({
        host: "smtp.gmail.com",
        port: 587,
        secure: false,
        auth: {
            user: user,
            pass: pass,
        },
    });
    const sendConfirmEmail = (emails, userId) => __awaiter(void 0, void 0, void 0, function* () {
        const accessToken = yield (0, jwt_service_1.generateToken)({ userId: userId }, accessTokenSecret, accessTokenLife);
        return yield transporter.sendMail({
            from: `utemeeting <${user}>`,
            to: emails,
            subject: "Sign Up Success",
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
    });
    const sendExpulsion = (roomId, emails) => __awaiter(void 0, void 0, void 0, function* () {
        var _a;
        const room = yield roomService.getDetail(roomId);
        return yield transporter.sendMail({
            from: `utemeeting <${user}>`,
            to: emails,
            subject: "Member Expulsion",
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
              <p style="font-size:larger;">Room owner: ${(_a = room.owner) === null || _a === void 0 ? void 0 : _a.name}</p>
              <p style="font-size:larger;">Room name: ${room.name}</p>
              <b style="font-size:larger;">You are no longer a room member of this room</b>
          <td style="width: auto"></td>
          </td>
      </tr>
  </table>`, // html body
        });
    });
    const sendInvitation = (roomId, emails) => __awaiter(void 0, void 0, void 0, function* () {
        var _b;
        const room = yield roomService.getDetail(roomId);
        return yield transporter.sendMail({
            from: `utemeeting <${user}>`,
            to: emails,
            subject: "Member Invitation",
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
              <p style="font-size:larger;">Room owner: ${(_b = room.owner) === null || _b === void 0 ? void 0 : _b.name}</p>
              <p style="font-size:larger;">Room name: ${room.name}</p>
              <p style="font-size:larger;">Room description: ${room.description}</p>
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
    });
    return { sendConfirmEmail, sendInvitation, sendExpulsion };
};
//# sourceMappingURL=mail.service.js.map