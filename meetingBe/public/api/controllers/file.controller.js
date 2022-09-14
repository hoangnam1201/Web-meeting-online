"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mime_1 = __importDefault(require("mime"));
const file_service_1 = __importDefault(require("../../services/file.service"));
exports.default = () => {
    const fileService = (0, file_service_1.default)();
    const downloadFile = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const fileId = req.params.id;
        if (!fileId)
            return res
                .status(400)
                .json({ status: 400, error: "id required in params" });
        const fileCursor = fileService.findById(fileId);
        const file = yield fileCursor.next();
        if (!file)
            return res.status(404).json({ status: 400, error: "not found" });
        res.setHeader("Content-disposition", "attachment; filename=" + file.filename);
        res.setHeader("Content-type", mime_1.default.getType(file.filename));
        fileService.getStreamFile(fileId).pipe(res);
    });
    return { downloadFile };
};
//# sourceMappingURL=file.controller.js.map