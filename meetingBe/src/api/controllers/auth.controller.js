import User from '../models/user.model.js'
import * as jwtService from '../services/jwt.service.js'
import crypto from 'crypto-js';
import dotenv from 'dotenv';
dotenv.config();

const accessTokenSecret = process.env.ACCESS_TOKEN_SECRET;
const accessTokenLife = process.env.ACCESS_TOKEN_LIFE;

export const login = async (req, res) => {
    const username = req.body.username;
    const password = req.body.password;
    console.log(accessTokenLife)
    try {

        const user = await User.findOne({ username: username }).exec()
        console.log(user)
        if (!user) return res.status(400).json({ err: 'invalid username' })
        if (user.password != crypto.SHA256(password).toString()) return res.status(400).json({ err: 'invalid password' })

        let dataUser = {
            userId: user._id,
        }

        const accessToken = await jwtService.generateToken(dataUser, accessTokenSecret, accessTokenLife)

        return res.json({ accessToken: accessToken, role: user.role })

    } catch (err) {
        return res.status(400).json({ status: 400, messager: err, data: null });
    }
}
