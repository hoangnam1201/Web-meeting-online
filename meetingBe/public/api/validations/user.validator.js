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
const express_validator_1 = require("express-validator");
const user_model_1 = __importDefault(require("../../models/user.model"));
const mongoose_1 = __importDefault(require("mongoose"));
const crypto_js_1 = __importDefault(require("crypto-js"));
class UserValidator {
    constructor() {
        this.userCreateValidator = () => {
            return [
                (0, express_validator_1.body)("username")
                    .exists()
                    .withMessage("required username")
                    .bail()
                    .isLength({ min: 5, max: 50 })
                    .withMessage("min length is 5 and max length is 50")
                    .bail()
                    .custom(checkUsernameExist)
                    .withMessage("username already exist"),
                (0, express_validator_1.body)("password", "invalid password")
                    .exists()
                    .withMessage("required password")
                    .bail()
                    .isLength({ min: 8 })
                    .withMessage("min length of password is 6"),
                (0, express_validator_1.body)("passwordConfirmation", "Confirmation is invalid")
                    .exists()
                    .withMessage("required ConfirmPassword")
                    .bail()
                    .custom((value, { req }) => value === req.body.password),
                (0, express_validator_1.body)("email", "invalid email")
                    .exists()
                    .bail()
                    .isEmail()
                    .bail()
                    .custom(checkEmailExist)
                    .withMessage("email already exist"),
                (0, express_validator_1.body)("phone", "invalid phone number")
                    .isInt()
                    .bail()
                    .isLength({ min: 9, max: 12 })
                    .exists(),
                (0, express_validator_1.body)("name", "invalid name").exists().isLength({ min: 5, max: 50 }),
            ];
        };
        this.changePasswordValidator = () => {
            return [
                (0, express_validator_1.body)("oldPassword", "invalid old password")
                    .exists()
                    .bail()
                    .custom(checkOldPassword),
                (0, express_validator_1.body)("password", "invalid password")
                    .exists()
                    .withMessage("required password")
                    .bail()
                    .isLength({ min: 8 })
                    .withMessage("min length of password is 6"),
                (0, express_validator_1.body)("passwordConfirmation", "Confirmation is invalid")
                    .exists()
                    .withMessage("required ConfirmPassword")
                    .bail()
                    .custom((value, { req }) => value === req.body.password),
            ];
        };
        this.changeInforValidator = () => {
            return [
                (0, express_validator_1.body)("phone", "invalid phone number")
                    .optional()
                    .isInt()
                    .bail()
                    .isLength({ min: 9, max: 12 })
                    .exists(),
                (0, express_validator_1.body)("name", "invalid name").optional().isLength({ min: 5, max: 50 }),
            ];
        };
    }
}
exports.default = UserValidator;
const checkUsernameExist = (username) => {
    return new Promise((resolved, rejected) => {
        user_model_1.default.findOne({ username }, (error, user) => {
            if (user) {
                rejected();
            }
            resolved(user);
        });
    });
};
const checkEmailExist = (value) => {
    return new Promise((resolved, rejected) => {
        user_model_1.default.findOne({ email: value }, (error, user) => {
            if (user) {
                rejected();
            }
            resolved(user);
        });
    });
};
const checkOldPassword = (passwod, meta) => {
    const { req } = meta;
    const userId = req.userData.userId;
    return new Promise((resolved, rejected) => __awaiter(void 0, void 0, void 0, function* () {
        const user = yield user_model_1.default
            .findOne({
            _id: new mongoose_1.default.Types.ObjectId(userId),
            password: crypto_js_1.default.SHA256(passwod).toString(),
        })
            .exec();
        if (user)
            resolved(user);
        rejected();
    }));
};
//# sourceMappingURL=user.validator.js.map