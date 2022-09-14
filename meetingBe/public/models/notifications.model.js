"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Notification = void 0;
const mongoose_1 = require("mongoose");
class Notification {
}
exports.Notification = Notification;
const notificationSchema = new mongoose_1.Schema({
    type: Number,
    content: String,
    fromUser: { type: mongoose_1.SchemaTypes.ObjectId, ref: "user" },
    fromRoom: { type: mongoose_1.SchemaTypes.ObjectId, ref: "room" },
    user: { type: mongoose_1.SchemaTypes.ObjectId, ref: "user" },
    isReaded: Boolean,
}, { timestamps: {} });
const notificationModel = (0, mongoose_1.model)("notification", notificationSchema);
exports.default = notificationModel;
//# sourceMappingURL=notifications.model.js.map