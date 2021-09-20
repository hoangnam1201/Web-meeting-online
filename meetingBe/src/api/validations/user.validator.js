import { body } from "express-validator"
import userModel from "../models/user.model.js"

export const userCreateValidator = () => {
    return [
        body('username')
            .exists().withMessage('required username').bail()
            .isLength({ min: 6, max: 50 }).withMessage('min length is 5 and max length is 50').bail()
            .custom(checkUsernameExist).withMessage('username already exist'),
        body('password', 'invalid password')
            .exists().withMessage('required password').bail()
            .isLength({ min: 6 }).withMessage('min length of password is 6'),
        body('passwordConfirmation', 'Confirmation is invalid')
            .exists().withMessage('required ConfirmPassword').bail()
            .custom((value, { req }) => value === req.body.password),
        body('email', 'invalid email')
            .exists().bail()
            .isEmail().bail()
            .custom(checkEmailExist).withMessage('email already exist'),
        body('phone', 'invalid phone number')
            .isInt().bail()
            .isLength({ min: 9, max: 12 }).exists(),
        body('dob', 'invalid dob')
            .exists()
            .isDate(),
        body('name', 'invalid name').exists().isLength({ min: 5, max: 50 })
    ]
}

const checkUsernameExist = async (value, { req }) => {
    try {
        const user = await userModel.findOne({ username: value }).exec();
        return user ? false : true;
    } catch {
        return false;
    }
}

const checkEmailExist = async (value, { req }) => {
    try {
        const user = await userModel.findOne({ email: value }).exec();
        return uer ? false : true;
    } catch {
        return false;
    }
}