import dotenv from 'dotenv';
import { NextFunction, Request, Response } from 'express';
import roomModel, { Room } from '../../models/room.model';
import * as jwtService from '../../services/jwt.service'
dotenv.config();

const accessTokenSecret = process.env.ACCESS_TOKEN_SECRET;

export default class AuthMiddlesware {
    static verifyToken = async (req: Request, res: Response, next: NextFunction) => {
        const token = req.headers.authorization.split(' ')[1];
        try {
            const decoded = await jwtService.verifyToken(token, accessTokenSecret);
            req.userData = decoded;
            next();
        } catch (err) {
            return res.status(401).json({
                errors: [{
                    value: token,
                    msg: 'invalid token',
                    location: 'header',
                }], status: 401
            });
        }
    }

    static checkClassOwnership = async (req: Request, res: Response, next: NextFunction) => {
        const roomId = req.params.roomId;
        const userId = req.userData.userId;
        roomModel.findById(roomId, (err: any, room: Room) => {
            if (err) {
                return res.status(400).json({ status: 400, errors: [{ msg: err }] });
            }
            if (!room) {
                return res.status(400).json({ status: 400, errors: [{ msg: 'not found room' }] });
            }
            if (room.owner.toString() !== userId) {
                return res.status(400).json({ status: 400, errors: [{ msg: 'you do not have permission' }] });
            }
            next();
        })
    }
}