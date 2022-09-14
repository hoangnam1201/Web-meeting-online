"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const auth_router_1 = __importDefault(require("./auth.router"));
const user_router_1 = __importDefault(require("./user.router"));
const room_router_1 = __importDefault(require("./room.router"));
const table_router_1 = __importDefault(require("./table.router"));
const file_router_1 = __importDefault(require("./file.router"));
const initRouter = (app) => {
    app.use("/api/auth", auth_router_1.default);
    app.use("/api/user", user_router_1.default);
    app.use("/api/room", room_router_1.default);
    app.use("/api/table", table_router_1.default);
    app.use("/api/file", file_router_1.default);
};
exports.default = initRouter;
//# sourceMappingURL=index.router.js.map