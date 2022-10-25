import { body } from "express-validator";
import userModel, { User } from "../../models/user.model";
import mongoose, { Error } from "mongoose";
import cryptoJS from "crypto-js";

export const userCreateValidator = () => {
  return [
    body("username")
      .exists()
      .withMessage("required username")
      .bail()
      .isLength({ min: 5, max: 50 })
      .withMessage("min length is 5 and max length is 50")
      .bail()
      .custom(checkUsernameExist)
      .withMessage("username already exist"),
    body("password", "invalid password")
      .exists()
      .withMessage("required password")
      .bail()
      .isLength({ min: 8 })
      .withMessage("min length of password is 6"),
    body("passwordConfirmation", "Confirmation is invalid")
      .exists()
      .withMessage("required ConfirmPassword")
      .bail()
      .custom((value, { req }) => value === req.body.password),
    body("email", "invalid email")
      .exists()
      .bail()
      .isEmail()
      .bail()
      .custom(checkEmailExist)
      .withMessage("email already exist"),
    body("phone", "invalid phone number")
      .isInt()
      .bail()
      .isLength({ min: 9, max: 12 })
      .exists(),
    body("name", "invalid name").exists().isLength({ min: 5, max: 50 }),
  ];
};

export const changePasswordValidator = () => {
  return [
    body("oldPassword", "invalid old password")
      .exists()
      .bail()
      .custom(checkOldPassword),
    body("password", "invalid password")
      .exists()
      .withMessage("required password")
      .bail()
      .isLength({ min: 8 })
      .withMessage("min length of password is 6"),
    body("passwordConfirmation", "Confirmation is invalid")
      .exists()
      .withMessage("required ConfirmPassword")
      .bail()
      .custom((value, { req }) => value === req.body.password),
  ];
};

export const changeInforValidator = () => {
  return [
    body("phone", "invalid phone number")
      .optional()
      .isInt()
      .bail()
      .isLength({ min: 9, max: 12 })
      .exists(),
    body("name", "invalid name").optional().isLength({ min: 5, max: 50 }),
  ];
};

const checkUsernameExist = (username: string) => {
  return new Promise((resolved, rejected) => {
    userModel.findOne({ username }, (error: Error, user: User) => {
      if (user) {
        rejected();
      }
      resolved(user);
    });
  });
};

const checkEmailExist = (value: string) => {
  return new Promise((resolved, rejected) => {
    userModel.findOne({ email: value }, (error: Error, user: User) => {
      if (user) {
        rejected();
      }
      resolved(user);
    });
  });
};

const checkOldPassword = (passwod: string, meta: { req: any }) => {
  const { req } = meta;
  const userId = req.userData.userId;
  return new Promise(async (resolved, rejected) => {
    const user = await userModel
      .findOne({
        _id: new mongoose.Types.ObjectId(userId),
        password: cryptoJS.SHA256(passwod).toString(),
      })
      .exec();
    if (user) resolved(user);
    rejected();
  });
};
