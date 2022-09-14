"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Token = void 0;
const mongoose_1 = require("mongoose");
class Token {
}
exports.Token = Token;
const schema = new mongoose_1.Schema({
    userId: { type: mongoose_1.SchemaTypes.ObjectId, ref: "user" },
    token: { type: String, required: true },
    createdAt: {
        type: mongoose_1.SchemaTypes.Date,
        default: Date.now(),
        expires: 10 * 24 * 60 * 60,
    },
});
exports.default = (0, mongoose_1.model)("token", schema);
//# sourceMappingURL=token.model.js.map