"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Room = void 0;
const mongoose_1 = require("mongoose");
class Room {
}
exports.Room = Room;
const RoomSchema = new mongoose_1.Schema({
    name: String,
    description: String,
    startDate: Number,
    endDate: Number,
    isPresent: Boolean,
    floors: [{ type: mongoose_1.SchemaTypes.ObjectId }],
    owner: { type: mongoose_1.SchemaTypes.ObjectId, ref: "user" },
    members: [{ type: mongoose_1.SchemaTypes.ObjectId, ref: "user" }],
    joiners: [{ type: mongoose_1.SchemaTypes.ObjectId, ref: "user" }],
});
exports.default = (0, mongoose_1.model)("room", RoomSchema);
//# sourceMappingURL=room.model.js.map