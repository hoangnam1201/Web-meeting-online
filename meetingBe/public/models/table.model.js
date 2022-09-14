"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Table = void 0;
const mongoose_1 = require("mongoose");
class Table {
}
exports.Table = Table;
const tableSchema = new mongoose_1.Schema({
    room: { type: mongoose_1.SchemaTypes.ObjectId, ref: "room" },
    name: String,
    users: [{ type: mongoose_1.SchemaTypes.ObjectId, ref: "user" }],
    members: [{ type: mongoose_1.SchemaTypes.ObjectId, ref: "user" }],
    floor: { type: mongoose_1.SchemaTypes.ObjectId },
    numberOfSeat: Number,
});
exports.default = (0, mongoose_1.model)("table", tableSchema);
//# sourceMappingURL=table.model.js.map