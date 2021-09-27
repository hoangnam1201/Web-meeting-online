import UserModel, { User } from '../models/user.model'
import * as jwtService from '../services/jwt.service'
import crypto from 'crypto-js';
import dotenv from 'dotenv';
import { Request, Response } from 'express';
dotenv.config();

const accessTokenSecret = process.env.ACCESS_TOKEN_SECRET;
const accessTokenLife = process.env.ACCESS_TOKEN_LIFE;

export default class AuthController {
    login = async (req: Request, res: Response) => {
        const username = req.body.username;
        const password = req.body.password;
        try {
            const user = await UserModel.findOne({ username }).exec()
            if (!user) return res.status(400).json({
                status: 400, errors: [
                    {
                        value: username,
                        msg: 'invalid username',
                        param: 'username'
                    }
                ]
            })
            if (user.password !== crypto.SHA256(password).toString()) return res.status(400).json({ err: 'invalid password' })
            const userData = {
                userId: user._id
            };
            const accessToken = await jwtService.generateToken(userData, accessTokenSecret, accessTokenLife)
            return res.json({ accessToken, role: user.role })
        } catch (err) {
            return res.status(400).json({ status: 400, errors: [{ msg: err }] });
        }
    }
}
