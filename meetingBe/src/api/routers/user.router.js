import { Router } from "express";
import * as userController from "../controllers/user.controller.js";
import { verifyToken } from "../middlewares/auth.middleware.js";
const userRoute = Router();

userRoute.get('/get-detail', verifyToken, userController.getDetail);
userRoute.post('/register', userController.register);
userRoute.get('/test', verifyToken, (req, res) => console.log('ok'));

export default userRoute;
