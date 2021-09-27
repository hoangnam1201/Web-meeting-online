import { Router } from 'express';
import AuthController from '../controllers/auth.controller';

const authRoute = Router();
const authController = new AuthController();

authRoute.post('/login',authController.login);

export default authRoute;