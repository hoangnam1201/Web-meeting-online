import dotenv from 'dotenv';
import * as jwtService from '../services/jwt.service.js'
dotenv.config();

const accessTokenSecret = process.env.ACCESS_TOKEN_SECRET;

export const verifyToken = async (req, res, next) => {
    console.log(accessTokenSecret)
    try {
        const token = req.headers.authorization.split(' ')[1];
        console.log(token)
        const decoded = await jwtService.verifyToken(token, accessTokenSecret);
        req.userData = decoded;
        console.log(req.userData)
        next();
    } catch (err) {
        return res.status(401).json({ message: 'invalid access token', data: err, status: 401 });
    }
}