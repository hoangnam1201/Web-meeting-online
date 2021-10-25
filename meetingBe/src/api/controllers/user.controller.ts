import UserModel, { User } from '../../models/user.model';
import cryptoJS from 'crypto-js';
import { validationResult } from 'express-validator';
import { Request, Response } from 'express';
import { Error } from 'mongoose';
import { UserReadDto } from '../../Dtos/user-read.dto';
import { UserCreateDto } from '../../Dtos/user-create.dto';
import UserChangeDto from '../../Dtos/user-change.dto';

export default class UserController {
    register = async (req: Request, res: Response) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ status: 400, ...errors });
        }
        const userCreate = UserCreateDto.fromUser(req.body);
        try {
            await UserModel.create(userCreate);
            return res.status(200).json({ status: 200, data: null });
        } catch (err) {
            return res.status(500).json({ status: 500, data: null, errors: [{ msg: err }] });
        }
    }

    getDetail = async (req: Request, res: Response) => {
        const userId = req.userData.userId;
        try {
            const user = await UserModel.findById(userId);
            const userRead = UserReadDto.fromUser(user);
            return res.status(200).json({ status: 200, data: userRead });
        } catch (err) {
            return res.status(500).json({ status: 500, data: null, errors: [{ msg: err }] });
        }
    }

    changeInfor = async (req: Request, res: Response) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ status: 400, ...errors });
        }
        const userId = req.userData.userId;
        const userChange = UserChangeDto.fromUser(req.body);
        try {
            const user = await UserModel.findByIdAndUpdate(userId, { ...userChange }, { new: true });
            return res.status(200).json({ status: 200, data: user })
        } catch (err) {
            return res.status(500).json({ status: 500, data: null, errors: [{ msg: err }] });
        }

    }

    changePassword = async (req: Request, res: Response) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ status: 400, ...errors });
        }

        const userId = req.userData.userId;
        const password = req.body.password;
        try {
            const user = await UserModel.findByIdAndUpdate(userId, { password: cryptoJS.SHA256(password).toString() });
            return res.status(200).json({ status: 200, data: user })
        } catch (err) {
            return res.status(500).json({ status: 500, data: null, errors: [{ msg: err }] });
        }
    }
}