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
const notifications_model_1 = __importDefault(require("../../models/notifications.model"));
exports.default = (io) => {
    const getNotification = (socket) => __awaiter(void 0, void 0, void 0, function* () {
        const userId = socket.data.userData.userId;
        try {
            const notification = yield notifications_model_1.default.find({ user: userId })
                .sort({ createdAt: 1 }).skip(0).limit(10);
            socket.emit('notifications', notification);
        }
        catch (err) {
            socket.emit('err', err);
        }
    });
    return {
        getNotification
    };
};
//# sourceMappingURL=notification.handler.js.map