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
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
const room_model_1 = __importDefault(require("../../models/room.model"));
const jwtService = __importStar(require("../../services/jwt.service"));
const token_service_1 = __importDefault(require("../../services/token.service"));
dotenv_1.default.config();
const accessTokenSecret = process.env.ACCESS_TOKEN_SECRET;
const refreshTokenSecret = process.env.REFRESH_TOKEN_SECRET;
class AuthMiddlesware {
}
exports.default = AuthMiddlesware;
_a = AuthMiddlesware;
AuthMiddlesware.verifyRefreshToken = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const tokenService = (0, token_service_1.default)();
    const { refreshToken } = req.body;
    const token = yield tokenService.getByToken(refreshToken);
    if (!token)
        return res.status(403).json({ status: 403, msg: "Forbidden" });
    try {
        const decoded = yield jwtService.verifyToken(refreshToken, refreshTokenSecret);
        req.userData = decoded;
        next();
    }
    catch (err) {
        return res.status(403).json({ status: 403, msg: "Forbidden" });
    }
});
AuthMiddlesware.verifyToken = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    if (!req.headers.authorization) {
        return res.status(401).json({
            msg: "Unauthorizated",
            status: 401,
        });
    }
    const token = req.headers.authorization.split(" ")[1];
    try {
        const decoded = yield jwtService.verifyToken(token, accessTokenSecret);
        req.userData = decoded;
        next();
    }
    catch (_b) {
        return res.status(401).json({ status: 401, msg: "Invalid Token" });
    }
});
AuthMiddlesware.checkClassOwnership = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const roomId = req.params.roomId;
    const userId = req.userData.userId;
    room_model_1.default.findById(roomId, (err, room) => {
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
                errors: [{ msg: "you do not have permission" }],
            });
        }
        next();
    });
});
//# sourceMappingURL=auth.middleware.js.map