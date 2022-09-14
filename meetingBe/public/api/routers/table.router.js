"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const express_validator_1 = require("express-validator");
const table_controller_1 = __importDefault(require("../controllers/table.controller"));
const auth_middleware_1 = __importDefault(require("../middlewares/auth.middleware"));
const table_validator_1 = __importDefault(require("../validations/table.validator"));
const tableRoute = (0, express_1.Router)();
const tableController = (0, table_controller_1.default)();
tableRoute.post("", [auth_middleware_1.default.verifyToken, ...table_validator_1.default.tablerCreateValidator()], tableController.createTable);
tableRoute.delete("/:tableId", auth_middleware_1.default.verifyToken, tableController.deleteTable);
tableRoute.put("/save-members/:roomId", auth_middleware_1.default.verifyToken, tableController.saveMember);
tableRoute.put("/add-user/:tableId", auth_middleware_1.default.verifyToken, tableController.addUser);
tableRoute.put("/remove-user/:tableId", auth_middleware_1.default.verifyToken, tableController.removeUser);
tableRoute.get("/:tableId", auth_middleware_1.default.verifyToken, tableController.getTable);
tableRoute.get("/get-by-room/:roomId", auth_middleware_1.default.verifyToken, tableController.getTablesInRoom);
tableRoute.get("/members/search/:roomId", tableController.searchMember);
tableRoute.get("/members/:roomId", auth_middleware_1.default.verifyToken, tableController.getMemberTables);
tableRoute.get("/in-room-and-floor/:roomId", [
    auth_middleware_1.default.verifyToken,
    (0, express_validator_1.query)("floor", "floor is required").exists().isString(),
], tableController.getTablesInRoomAndFloor);
exports.default = tableRoute;
//# sourceMappingURL=table.router.js.map