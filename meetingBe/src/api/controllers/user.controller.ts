import UserModel, { User } from '../models/user.model';
import cryptoJS from 'crypto-js';
import { validationResult } from 'express-validator';
import { Request, Response } from 'express';
import { Error } from 'mongoose';
import { UserReadDto } from '../Dtos/UserReadDto';
import { UserCreateDto } from '../Dtos/UserCreateDto';

export default class UserController {
    register = (req: Request, res: Response) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ status: 400, ...errors });
        }
        const userCreate = UserCreateDto.fromUser(req.body);
        UserModel.create(userCreate, (err: any) => {
            if (err) {
                return res.status(400).json({ status: 400, data: null, errors: [{ msg: err }] });
            }
            return res.status(200).json({ status: 200, data: null });
        })
    }

    getDetail = (req: Request, res: Response) => {
        const userId = req.userData.userId;
        UserModel.findById(userId, (err: Error, user: User) => {
            if (err) {
                return res.status(400).json({ status: 400, data: null, errors: [{ msg: err }] });
            }
            const userRead = UserReadDto.fromUser(user);
            return res.status(200).json({ status: 200, data: userRead });
        })
    }

    changeInfor = (req: Request, res: Response) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ status: 400, ...errors });
        }
        const userId = req.userData.userId;
        UserModel.findByIdAndUpdate(userId, { ...req.body }, (err: Error, user: User) => {
            if (err) {
                return res.status(400).json({ status: 400, data: null, errors: [{ msg: err }] });
            }
            return res.status(200).json({ status: 200, data: null })
        })
    }

    changePassword = (req: Request, res: Response) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ status: 400, ...errors });
        }
        const userId = req.userData.userId;
        const password = req.body.password;
        UserModel.findByIdAndUpdate(userId, { password: cryptoJS.SHA256(password).toString() }, (err, _) => {
            if (err) {
                return res.status(400).json({ status: 400, data: null, errors: [{ err }] });
            }
            return res.status(200).json({ status: 200, data: null })

        });
    }
}