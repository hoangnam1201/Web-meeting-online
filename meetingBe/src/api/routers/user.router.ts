import { Router } from "express";
import UserController from "../controllers/user.controller";
import AuthMiddlesware from "../middlewares/auth.middleware";
import {
  changeInforValidator,
  changePasswordValidator,
  userCreateValidator,
} from "../validations/user.validator";

const userRoute = Router();
const userController = UserController();

userRoute.get(
  "",
  [AuthMiddlesware.verifyToken, AuthMiddlesware.checkHostPermission],
  userController.getUsers
);

userRoute.get(
  "/get-by-id/:userId",
  [AuthMiddlesware.verifyToken],
  userController.getById
);

userRoute.put(
  "/update-permission",
  [AuthMiddlesware.verifyToken, AuthMiddlesware.checkAdminPermission],
  userController.updatePermission
);
userRoute.get(
  "/get-detail",
  AuthMiddlesware.verifyToken,
  userController.getDetail
);
userRoute.post("/register", userCreateValidator(), userController.register);
userRoute.put(
  "/change-infor",
  [AuthMiddlesware.verifyToken, ...changeInforValidator()],
  userController.changeInfor
);
userRoute.put(
  "/change-password",
  [AuthMiddlesware.verifyToken, ...changePasswordValidator()],
  userController.changePassword
);
userRoute.get(
  "/search",
  [AuthMiddlesware.verifyToken],
  userController.searchUser
);

export default userRoute;
