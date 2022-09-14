"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const file_controller_1 = __importDefault(require("../controllers/file.controller"));
const fileRouter = (0, express_1.Router)();
const fileController = (0, file_controller_1.default)();
fileRouter.get("/download/:id", fileController.downloadFile);
exports.default = fileRouter;
//# sourceMappingURL=file.router.js.map