"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyToken = exports.generateToken = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const generateToken = (userData, secretKey, tokenLife) => {
    return new Promise((resolve, reject) => {
        jsonwebtoken_1.default.sign(userData, secretKey, {
            expiresIn: tokenLife,
        }, (error, token) => {
            if (error) {
                return reject(error);
            }
            return resolve(token);
        });
    });
};
exports.generateToken = generateToken;
const verifyToken = (token, secretKey) => {
    return new Promise((resoleve, reject) => {
        jsonwebtoken_1.default.verify(token, secretKey, (error, decoded) => {
            if (error) {
                reject(error);
            }
            resoleve(decoded);
        });
    });
};
exports.verifyToken = verifyToken;
//# sourceMappingURL=jwt.service.js.map