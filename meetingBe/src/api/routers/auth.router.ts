import { Router } from "express";
import AuthController from "../controllers/auth.controller";
import AuthMiddlesware from "../middlewares/auth.middleware";

const authRoute = Router();
const authController = AuthController();

authRoute.post("/login", authController.login);
authRoute.get("/get-verify-email", [
  AuthMiddlesware.verifyToken,
  authController.getVerifyMail,
]);
authRoute.get("/verify", authController.verifyEmail);

export default authRoute;
