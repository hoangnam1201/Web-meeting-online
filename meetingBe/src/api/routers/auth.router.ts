import { Router } from "express";
import AuthController from "../controllers/auth.controller";
import AuthMiddlesware from "../middlewares/auth.middleware";

const authRoute = Router();
const authController = AuthController();

authRoute.post("/login", authController.login);
authRoute.post("/google-login", authController.googleLogin);
authRoute.post("/token/revoke", authController.revoke);
authRoute.post(
  "/token",
  AuthMiddlesware.verifyRefreshToken,
  authController.getToken
);
authRoute.get(
  "/get-verify-email",
  AuthMiddlesware.verifyToken,
  authController.getVerifyMail
);
authRoute.get("/verify", authController.verifyEmail);

export default authRoute;
