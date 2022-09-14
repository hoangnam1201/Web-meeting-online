"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_controller_1 = __importDefault(require("../controllers/auth.controller"));
const auth_middleware_1 = __importDefault(require("../middlewares/auth.middleware"));
const authRoute = (0, express_1.Router)();
const authController = (0, auth_controller_1.default)();
authRoute.post("/login", authController.login);
authRoute.post("/google-login", authController.googleLogin);
authRoute.post("/token/revoke", authController.revoke);
authRoute.post("/token", auth_middleware_1.default.verifyRefreshToken, authController.getToken);
authRoute.get("/get-verify-email", auth_middleware_1.default.verifyToken, authController.getVerifyMail);
authRoute.get("/verify", authController.verifyEmail);
exports.default = authRoute;
//# sourceMappingURL=auth.router.js.map