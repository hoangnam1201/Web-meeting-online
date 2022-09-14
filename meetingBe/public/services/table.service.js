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
const mongoose_1 = __importDefault(require("mongoose"));
const room_model_1 = __importDefault(require("../models/room.model"));
const table_model_1 = __importDefault(require("../models/table.model"));
exports.default = () => {
    const create = (tableData) => {
        return table_model_1.default.create(tableData);
    };
    const saveMember = (roomId) => {
        return table_model_1.default.updateMany({ room: roomId }, [
            {
                $set: { members: "$users" },
            },
        ]);
    };
    const removeTable = (tableId) => {
        return table_model_1.default.deleteOne({ _id: tableId });
    };
    const addUser = (tableId, userId) => {
        return table_model_1.default.updateOne({ _id: tableId }, { $addToSet: { members: userId } });
    };
    const removeUser = (tableId, userId) => {
        return table_model_1.default.updateOne({ _id: tableId }, { $pull: { members: userId } });
    };
    const getDetail = (tableId) => {
        return table_model_1.default
            .findById(tableId)
            .populate({ path: "members", select: "name username _id email" });
    };
    const getById = (tableId) => {
        return table_model_1.default.findById(tableId);
    };
    const getTablesInRoom = (roomId) => {
        return table_model_1.default.find({
            room: roomId,
        });
    };
    const getTablesByRoomAndFloor = (roomId, floorId) => {
        return table_model_1.default.find({ room: roomId, floor: floorId }).populate("users");
    };
    const addJoiner = (roomId, tableId, userId) => __awaiter(void 0, void 0, void 0, function* () {
        yield table_model_1.default.updateMany({ room: roomId }, { $pull: { users: userId } });
        return table_model_1.default.updateOne({ _id: tableId }, { $addToSet: { users: userId } });
    });
    const findAndClearJoiner = (roomId) => __awaiter(void 0, void 0, void 0, function* () {
        yield table_model_1.default.updateMany({ room: roomId }, { users: [] });
        return table_model_1.default.find({ room: roomId }).populate("users");
    });
    const removeJoiner = (tableId, userId) => {
        return table_model_1.default.findByIdAndUpdate(tableId, { $pull: { users: userId } }, { new: true });
    };
    const searchMember = (roomId) => {
        return room_model_1.default
            .aggregate()
            .match({ _id: new mongoose_1.default.Types.ObjectId(roomId) })
            .lookup({
            from: "tables",
            let: { id: "$_id" },
            pipeline: [
                { $match: { $expr: { $eq: ["$$id", "$room"] } } },
                {
                    $unwind: {
                        path: "$members",
                        preserveNullAndEmptyArrays: true,
                    },
                },
                { $group: { _id: "$room", members: { $addToSet: "$members" } } },
            ],
            as: "table",
        })
            .unwind({
            path: "$table",
            preserveNullAndEmptyArrays: true,
        }, {
            path: "$members",
            preserveNullAndEmptyArrays: true,
        })
            .match({ $expr: { $not: { $in: ["$members", "$table.members"] } } })
            .group({
            _id: "$_id",
            members: { $addToSet: "$members" },
            table: { $push: "$table" },
        })
            .lookup({
            from: "users",
            let: { mb: "$members" },
            pipeline: [
                { $match: { $expr: { $in: ["$_id", "$$mb"] } } },
                { $project: { _id: 1, name: 1, username: 1, email: 1 } },
            ],
            as: "members",
        });
    };
    const getMemberTables = (roomId, limit, page) => {
        return table_model_1.default
            .aggregate()
            .match({ room: new mongoose_1.default.Types.ObjectId(roomId) })
            .lookup({
            from: "users",
            let: { mb: "$members" },
            pipeline: [
                { $match: { $expr: { $in: ["$_id", "$$mb"] } } },
                { $project: { _id: 1, name: 1, username: 1, email: 1 } },
            ],
            as: "members",
        })
            .facet({
            count: [{ $count: "count" }],
            results: [{ $skip: limit * page }, { $limit: limit }],
        })
            .addFields({
            count: { $arrayElemAt: ["$count.count", 0] },
        });
    };
    return {
        findAndClearJoiner,
        getById,
        create,
        addJoiner,
        removeJoiner,
        getTablesByRoomAndFloor,
        getMemberTables,
        saveMember,
        removeTable,
        addUser,
        removeUser,
        getDetail,
        getTablesInRoom,
        searchMember,
    };
};
//# sourceMappingURL=table.service.js.map