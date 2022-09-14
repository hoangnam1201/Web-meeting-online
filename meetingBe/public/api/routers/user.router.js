"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const user_controller_1 = __importDefault(require("../controllers/user.controller"));
const auth_middleware_1 = __importDefault(require("../middlewares/auth.middleware"));
const user_validator_1 = __importDefault(require("../validations/user.validator"));
const userRoute = (0, express_1.Router)();
const userController = (0, user_controller_1.default)();
const userValidator = new user_validator_1.default();
userRoute.get("/get-detail", auth_middleware_1.default.verifyToken, userController.getDetail);
userRoute.post("/register", userValidator.userCreateValidator(), userController.register);
userRoute.put("/change-infor", [auth_middleware_1.default.verifyToken, ...userValidator.changeInforValidator()], userController.changeInfor);
userRoute.put("/change-password", [auth_middleware_1.default.verifyToken, ...userValidator.changePasswordValidator()], userController.changePassword);
userRoute.get("/search", [auth_middleware_1.default.verifyToken], userController.searchUser);
exports.default = userRoute;
//# sourceMappingURL=user.router.js.map