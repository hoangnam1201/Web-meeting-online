"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const notifications_model_1 = __importDefault(require("../models/notifications.model"));
exports.default = () => {
    const Type = { success: 0, receiptInvitation: 1, isRemoved: 2 };
    const createType0N = (userId, content) => {
        return notifications_model_1.default.create({ user: userId, content, isReaded: false });
    };
    const createType12N = (userId, nType, fromUser, fromRoom) => {
        return notifications_model_1.default.create({
            user: userId,
            type: nType,
            content: nType === 1
                ? "You are invited to join room"
                : "You were removed from class",
            isReaded: false,
            fromRoom,
            fromUser,
        });
    };
    const read = (nId) => {
        return notifications_model_1.default.findOneAndUpdate({ _id: nId }, { isRead: true });
    };
    const getByUserId = (userId, take, page) => {
        return notifications_model_1.default
            .aggregate()
            .match({ user: new mongoose_1.default.Types.ObjectId(userId) })
            .lookup({
            from: "users",
            let: { fromUser: "$fromUser" },
            pipeline: [
                { $match: { $expr: { $eq: ["$_id", "$$fromUser"] } } },
                { $project: { _id: 1, name: 1, username: 1, email: 1 } },
            ],
            as: "owner",
        })
            .lookup({
            from: "rooms",
            let: { fromUser: "$fromRoom" },
            pipeline: [
                { $match: { $expr: { $eq: ["$_id", "$$fromRoom"] } } },
                { $project: { _id: 1, name: 1 } },
            ],
            as: "owner",
        })
            .facet({
            count: [{ $count: "count" }],
            results: [{ $skip: take * page, $limit: take }],
        })
            .addFields({ count: { $arrayElemAt: ["$count.count", [0]] } });
    };
    return {
        createType0N,
        createType12N,
        Type,
        read,
        getByUserId,
    };
};
//# sourceMappingURL=notification.service.js.map