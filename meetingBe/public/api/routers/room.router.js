"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const express_validator_1 = require("express-validator");
const room_controller_1 = __importDefault(require("../controllers/room.controller"));
const auth_middleware_1 = __importDefault(require("../middlewares/auth.middleware"));
const room_validator_1 = __importDefault(require("../validations/room.validator"));
const roomRoute = (0, express_1.Router)();
const roomController = (0, room_controller_1.default)();
roomRoute.post("", [auth_middleware_1.default.verifyToken, ...room_validator_1.default.createRoomValidator()], roomController.createRoom);
roomRoute.delete("/:roomId", [auth_middleware_1.default.verifyToken, auth_middleware_1.default.checkClassOwnership], roomController.deleteRoom);
roomRoute.put("/:roomId", [
    auth_middleware_1.default.verifyToken,
    auth_middleware_1.default.checkClassOwnership,
    ...room_validator_1.default.changeRoomValidator(),
], roomController.changeRoom);
roomRoute.get("/owned-room", auth_middleware_1.default.verifyToken, roomController.getOwnedRoom);
roomRoute.get("/invited-room", auth_middleware_1.default.verifyToken, roomController.getInvitedRoom);
roomRoute.get("/:roomId", auth_middleware_1.default.verifyToken, roomController.getRoomById);
roomRoute.post("/members/add-member/:roomId", [
    auth_middleware_1.default.verifyToken,
    auth_middleware_1.default.checkClassOwnership,
    (0, express_validator_1.body)("userId", "invalid userId").exists().isString(),
], roomController.addMember);
roomRoute.delete("/members/remove-member/:roomId", [
    auth_middleware_1.default.verifyToken,
    auth_middleware_1.default.checkClassOwnership,
    (0, express_validator_1.body)("userId", "invalid userId").exists().isString(),
], roomController.removeMember);
roomRoute.post("/members/add-members/:roomId", [
    auth_middleware_1.default.verifyToken,
    auth_middleware_1.default.checkClassOwnership,
    (0, express_validator_1.body)("userIds", "invalid userId").exists().isArray(),
], roomController.addMembers);
roomRoute.delete("/members/remove-members/:roomId", [
    auth_middleware_1.default.verifyToken,
    auth_middleware_1.default.checkClassOwnership,
    (0, express_validator_1.body)("userIds", "invalid userId").exists().isArray(),
], roomController.removeMembers);
roomRoute.post("/floors/:roomId", [auth_middleware_1.default.verifyToken, auth_middleware_1.default.checkClassOwnership], roomController.increaseFloors);
roomRoute.delete("/floors/:roomId", [
    auth_middleware_1.default.verifyToken,
    auth_middleware_1.default.checkClassOwnership,
    (0, express_validator_1.query)("floor", "invalid floor").exists().isString(),
], roomController.deleteFloor);
exports.default = roomRoute;
//# sourceMappingURL=room.router.js.map