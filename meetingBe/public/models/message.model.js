"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Message = void 0;
const mongoose_1 = require("mongoose");
class Message {
}
exports.Message = Message;
const messageSchema = new mongoose_1.Schema({
    room: { type: mongoose_1.SchemaTypes.ObjectId, ref: "room" },
    sender: { type: mongoose_1.SchemaTypes.ObjectId, ref: "user" },
    message: String,
    files: [{ fileId: String, name: String }],
    like: [
        {
            option: Number,
            user: { type: mongoose_1.SchemaTypes.ObjectId, ref: "user" },
        },
    ],
}, { timestamps: {} });
exports.default = (0, mongoose_1.model)("message", messageSchema);
//# sourceMappingURL=message.model.js.map