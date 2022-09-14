"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const fs_1 = require("fs");
const mongodb_1 = require("mongodb");
let gridfsBucket;
mongoose_1.default.connection.once("open", () => {
    gridfsBucket = new mongoose_1.default.mongo.GridFSBucket(mongoose_1.default.connection.db, {
        bucketName: "uploadFiles",
    });
});
exports.default = () => {
    const putFile = (name, data) => {
        return new Promise((resolve, reject) => {
            const writestream = gridfsBucket.openUploadStream(name);
            const readableStream = fs_1.ReadStream.from(data);
            readableStream.pipe(writestream);
            writestream.on("finish", () => {
                resolve(writestream.id);
            });
            writestream.on("error", (error) => {
                reject(error);
            });
        });
    };
    const getStreamFile = (id) => {
        return gridfsBucket.openDownloadStream(new mongodb_1.ObjectId(id));
    };
    const removeFile = (id) => {
        return gridfsBucket.delete(new mongodb_1.ObjectId(id));
    };
    const findById = (id) => {
        return gridfsBucket.find({ _id: new mongodb_1.ObjectId(id) });
    };
    return { putFile, getStreamFile, removeFile, findById };
};
//# sourceMappingURL=file.service.js.map