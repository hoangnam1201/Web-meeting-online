"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
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
const user_model_1 = __importDefault(require("../../models/user.model"));
const jwtService = __importStar(require("../../services/jwt.service"));
const crypto_js_1 = __importDefault(require("crypto-js"));
const dotenv_1 = __importDefault(require("dotenv"));
const user_service_1 = __importDefault(require("../../services/user.service"));
const mail_service_1 = __importDefault(require("../../services/mail.service"));
const token_service_1 = __importDefault(require("../../services/token.service"));
const user_model_2 = __importDefault(require("../../models/user.model"));
const google_auth_library_1 = require("google-auth-library");
dotenv_1.default.config();
const accessTokenSecret = process.env.ACCESS_TOKEN_SECRET;
const accessTokenLife = process.env.ACCESS_TOKEN_LIFE;
const refreshTokenSecret = process.env.REFRESH_TOKEN_SECRET;
const refreshTokenLife = process.env.REFRESH_TOKEN_LIFE;
const clientId = process.env.CLIENT_ID;
const client = new google_auth_library_1.OAuth2Client(clientId);
exports.default = () => {
    const userService = (0, user_service_1.default)();
    const mailService = (0, mail_service_1.default)();
    const tokenService = (0, token_service_1.default)();
    const getToken = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const accessToken = yield jwtService.generateToken({ userId: req.userData.userId }, accessTokenSecret, accessTokenLife);
            res.status(200).json({ status: 200, data: accessToken });
        }
        catch (_a) {
            res.status(500).json({ status: 500, msg: "Internal Server Error" });
        }
    });
    const revoke = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const { refreshToken } = req.body;
        try {
            yield tokenService.remove(refreshToken);
            res.status(200).json({ status: 200, data: null });
        }
        catch (_b) {
            res.status(500).json({ status: 500, msg: "Internal Server Error" });
        }
    });
    const googleLogin = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const { token } = req.body;
        try {
            const tiket = yield client.verifyIdToken({
                idToken: token,
                audience: clientId,
            });
            const payload = tiket.getPayload();
            const user = yield userService.findUserByEmail(payload.email);
            if (user) {
                const accessToken = yield jwtService.generateToken({ userId: user._id }, accessTokenSecret, accessTokenLife);
                const refreshToken = yield jwtService.generateToken({ userId: user._id }, refreshTokenSecret, refreshTokenLife);
                yield tokenService.create(refreshToken, user._id);
                return res.json({ accessToken, refreshToken });
            }
            else {
                const user = new user_model_2.default({
                    name: payload.name,
                    email: payload.email,
                    picture: payload.picture,
                });
                yield user.save();
                const accessToken = yield jwtService.generateToken({ userId: user._id }, accessTokenSecret, accessTokenLife);
                const refreshToken = yield jwtService.generateToken({ userId: user._id }, refreshTokenSecret, refreshTokenLife);
                yield tokenService.create(refreshToken, user._id);
                return res.json({ accessToken, refreshToken });
            }
        }
        catch (err) {
            console.log(err);
            return res.status(401).json({ status: 401, msg: "Invalid Token" });
        }
    });
    const login = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const username = req.body.username;
        const password = req.body.password;
        try {
            const user = yield user_model_1.default.findOne({ username });
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
            if (user.password !== crypto_js_1.default.SHA256(password).toString())
                return res.status(400).json({ err: "invalid password" });
            const userData = {
                userId: user._id,
            };
            const accessToken = yield jwtService.generateToken(userData, accessTokenSecret, accessTokenLife);
            const refreshToken = yield jwtService.generateToken(userData, refreshTokenSecret, refreshTokenLife);
            yield tokenService.create(refreshToken, user._id);
            return res.json({ accessToken, refreshToken });
        }
        catch (err) {
            console.log(err);
            return res
                .status(500)
                .json({ status: 500, msg: "Internal Server Error" });
        }
    });
    const verifyEmail = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const token = req.query.token;
        if (!token)
            return res.status(401).json({
                msg: "Unauthorizated",
                status: 401,
            });
        try {
            const decoded = yield jwtService.verifyToken(token, accessTokenSecret);
            yield userService.verifyEmail(decoded.userId);
            res.status(200).json({ status: 200, data: null });
        }
        catch (_c) {
            return res
                .status(500)
                .json({ status: 500, msg: "Internal Server Error" });
        }
    });
    const getVerifyMail = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const userId = req.userData.userId;
        try {
            const user = yield userService.findUserById(userId);
            if (!user)
                return res.status(400).json({ status: 400, msg: "Not Found User" });
            yield mailService.sendConfirmEmail(user.email, user._id);
            res.status(200).json({ status: 200, data: null });
        }
        catch (_d) {
            return res
                .status(500)
                .json({ status: 500, msg: "Internal Server Error" });
        }
    });
    return { login, verifyEmail, getVerifyMail, getToken, revoke, googleLogin };
};
//# sourceMappingURL=auth.controller.js.map