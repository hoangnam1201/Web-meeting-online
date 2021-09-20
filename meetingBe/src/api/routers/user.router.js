import { Router } from "express";
import * as userController from "../controllers/user.controller.js";
import { verifyToken } from "../middlewares/auth.middleware.js";
import { userCreateValidator } from "../validations/user.validator.js";
const userRoute = Router();

userRoute.get('/get-detail', verifyToken, userController.getDetail);
userRoute.post('/register', userCreateValidator(), userController.register);

export default userRoute;
