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
const room_model_1 = __importDefault(require("../models/room.model"));
const user_model_1 = __importDefault(require("../models/user.model"));
const mongoose_1 = __importDefault(require("mongoose"));
const mongodb_1 = require("mongodb");
const table_model_1 = __importDefault(require("../models/table.model"));
const message_model_1 = __importDefault(require("../models/message.model"));
exports.default = () => {
    const findById = (id) => {
        return room_model_1.default.findById(id);
    };
    const create = (roomData) => {
        return room_model_1.default.create(Object.assign(Object.assign({}, roomData), { floors: [new mongodb_1.ObjectId()] }));
    };
    const deleteRoom = (roomId) => __awaiter(void 0, void 0, void 0, function* () {
        yield message_model_1.default.deleteMany({ room: roomId });
        yield table_model_1.default.deleteMany({ room: roomId });
        const room = yield room_model_1.default.findOneAndDelete({ _id: roomId });
        return user_model_1.default.updateMany({ _id: { $in: room.members } }, { $pull: { invitedRooms: roomId } });
    });
    const changeRoomInfo = (roomId, roomData) => {
        return room_model_1.default.updateOne({ _id: roomId }, roomData);
    };
    const inscreaseFloors = (roomId) => {
        return room_model_1.default.updateOne({ _id: roomId }, { $push: { floors: new mongodb_1.ObjectId() } });
    };
    const findOneAndRemoveJoiner = (roomId, userId) => {
        return room_model_1.default
            .findOneAndUpdate({ _id: roomId }, { $pull: { joiners: userId } }, { timestamps: true, new: true })
            .populate("joiners");
    };
    const findOneAndAddJoiner = (roomId, userId) => {
        return room_model_1.default
            .findOneAndUpdate({ _id: roomId }, { $addToSet: { joiners: userId } }, { timestamps: true, new: true })
            .populate("joiners");
    };
    const findOneAndUpdatePresent = (roomId, isPresent) => {
        return room_model_1.default.findByIdAndUpdate(roomId, { isPresent: isPresent }, { new: true });
    };
    const deleteFloor = (roomId, floorId) => __awaiter(void 0, void 0, void 0, function* () {
        yield table_model_1.default.deleteMany({ room: roomId, floor: floorId });
        return room_model_1.default.updateOne({ _id: roomId }, { $pull: { floors: floorId } });
    });
    const getDetail = (roomId) => {
        return room_model_1.default
            .findById({ _id: roomId })
            .populate("members")
            .populate("owner");
    };
    const getOwnedRooms = (userId) => {
        return room_model_1.default.find({ owner: userId }).populate("owner");
    };
    const getPageDataOwnedRooms = (userId, take, page) => {
        if (!take && !page) {
            return room_model_1.default.find({ owner: userId }).populate("owner");
        }
        return room_model_1.default
            .aggregate()
            .match({ owner: new mongoose_1.default.Types.ObjectId(userId) })
            .lookup({
            from: "users",
            let: { owner: "$owner" },
            pipeline: [
                { $match: { $expr: { $eq: ["$_id", "$$owner"] } } },
                { $project: { _id: 1, name: 1, username: 1, email: 1 } },
            ],
            as: "owner",
        })
            .unwind("owner")
            .facet({
            count: [{ $count: "count" }],
            results: [{ $skip: take * page }, { $limit: take }],
        })
            .addFields({ count: { $arrayElemAt: ["$count.count", 0] } });
    };
    const getInvitedRoom = (userId) => __awaiter(void 0, void 0, void 0, function* () {
        const user = yield user_model_1.default.findById(userId).populate([
            {
                path: "invitedRooms",
                populate: {
                    path: "owner",
                },
            },
        ]);
        return user.invitedRooms;
    });
    const getPageDataInvitedRooms = (userId, take, page) => {
        if (!take && !page) {
            return room_model_1.default.find({ _id: userId }).populate("invitedRooms");
        }
        return user_model_1.default
            .aggregate()
            .match({ _id: new mongoose_1.default.Types.ObjectId(userId) })
            .lookup({
            from: "rooms",
            let: { invitedRooms: "$invitedRooms" },
            pipeline: [
                { $match: { $expr: { $in: ["$_id", "$$invitedRooms"] } } },
                {
                    $lookup: {
                        from: "users",
                        let: { owner: "$owner" },
                        pipeline: [
                            { $match: { $expr: { $eq: ["$_id", "$$owner"] } } },
                            { $project: { _id: 1, name: 1, username: 1, email: 1 } },
                        ],
                        as: "owner",
                    },
                },
                {
                    $facet: {
                        count: [{ $count: "count" }],
                        results: [{ $skip: take * page }, { $limit: take }],
                    },
                },
                { $addFields: { count: { $arrayElemAt: ["$count.count", 0] } } },
            ],
            as: "invitedRooms",
        })
            .addFields({ roomData: { $first: "$invitedRooms" } })
            .project({
            _id: 0,
            count: "$roomData.count",
            results: "$roomData.results",
        });
    };
    const addMember = (userId, roomId) => __awaiter(void 0, void 0, void 0, function* () {
        const room = yield room_model_1.default.findOneAndUpdate({ _id: roomId }, { $addToSet: { members: userId } });
        yield user_model_1.default.updateOne({ _id: userId }, {
            $addToSet: {
                invitedRooms: roomId,
            },
        });
        return room;
    });
    const addMembers = (userIds, roomId) => __awaiter(void 0, void 0, void 0, function* () {
        yield room_model_1.default.findOneAndUpdate({ _id: roomId }, {
            $addToSet: {
                members: {
                    $each: userIds,
                },
            },
        });
        yield user_model_1.default.updateMany({ _id: { $in: userIds } }, {
            $addToSet: {
                invitedRooms: roomId,
            },
        });
    });
    const removeMember = (userId, roomId) => __awaiter(void 0, void 0, void 0, function* () {
        yield room_model_1.default.updateOne({ _id: roomId }, { $pull: { members: userId } });
        yield user_model_1.default.updateOne({ _id: userId }, { $pull: { invitedRooms: roomId } });
    });
    const removeMembers = (userIds, roomId) => __awaiter(void 0, void 0, void 0, function* () {
        const room = yield room_model_1.default.findOneAndUpdate({ _id: roomId }, {
            $pull: {
                members: {
                    $each: userIds,
                },
            },
        });
        yield user_model_1.default.updateMany({ _id: { $in: userIds } }, {
            $pull: {
                invitedRooms: room._id,
            },
        });
    });
    const checkCanAccept = (roomId, userId) => {
        return room_model_1.default.exists({
            $or: [
                { _id: roomId, members: userId },
                { _id: roomId, owner: userId },
            ],
        });
    };
    return {
        checkCanAccept,
        findById,
        findOneAndAddJoiner,
        findOneAndRemoveJoiner,
        findOneAndUpdatePresent,
        inscreaseFloors,
        deleteFloor,
        create,
        getDetail,
        deleteRoom,
        changeRoomInfo,
        getPageDataOwnedRooms,
        getOwnedRooms,
        getPageDataInvitedRooms,
        getInvitedRoom,
        addMember,
        addMembers,
        removeMember,
        removeMembers,
    };
};
//# sourceMappingURL=room.service.js.map