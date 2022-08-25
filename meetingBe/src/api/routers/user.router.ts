import { Router } from "express";
import UserController from "../controllers/user.controller";
import AuthMiddlesware from "../middlewares/auth.middleware";
import UserValidator from "../validations/user.validator";

const userRoute = Router();
const userController = UserController();
const userValidator = new UserValidator();

userRoute.get(
  "/get-detail",
  AuthMiddlesware.verifyToken,
  userController.getDetail
);
userRoute.post(
  "/register",
  userValidator.userCreateValidator(),
  userController.register
);
userRoute.put(
  "/change-infor",
  [AuthMiddlesware.verifyToken, ...userValidator.changeInforValidator()],
  userController.changeInfor
);
userRoute.put(
  "/change-password",
  [AuthMiddlesware.verifyToken, ...userValidator.changePasswordValidator()],
  userController.changePassword
);
userRoute.get(
  "/search",
  [AuthMiddlesware.verifyToken],
  userController.searchUser
);

export default userRoute;
