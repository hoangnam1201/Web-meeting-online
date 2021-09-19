import { Router } from 'express';
import { login } from '../controllers/auth.controller.js';

const authRoute = Router();

authRoute.post('/login',login);

export default authRoute;