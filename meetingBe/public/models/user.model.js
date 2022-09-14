"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.User = void 0;
const mongoose_1 = require("mongoose");
class User {
}
exports.User = User;
const userSchema = new mongoose_1.Schema({
    username: { type: String },
    password: { type: String },
    // socketId: { type: String, default: "" },
    name: { type: String, required: true },
    isLock: { type: Boolean, default: false },
    phone: { type: String },
    email: { type: String, required: true },
    picture: { type: String, required: false },
    invitedRooms: [{ type: mongoose_1.SchemaTypes.ObjectId, ref: "room" }],
    isVerify: { type: Boolean, default: false },
}, { timestamps: {} });
exports.default = (0, mongoose_1.model)("user", userSchema);
//# sourceMappingURL=user.model.js.map