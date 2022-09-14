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
const message_model_1 = __importDefault(require("../models/message.model"));
exports.default = () => {
    const create = (sender, roomId, message, files) => __awaiter(void 0, void 0, void 0, function* () {
        const messageRead = yield message_model_1.default.create({
            sender,
            message,
            files,
            room: roomId,
        });
        return messageRead.populate("sender");
    });
    const getMessages = (room, take, skip) => {
        return message_model_1.default
            .find({ room: room })
            .populate("sender")
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(take);
    };
    return { create, getMessages };
};
//# sourceMappingURL=message.service.js.map