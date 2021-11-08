import UserModel, { User } from '../../models/user.model';
import cryptoJS from 'crypto-js';
import { validationResult } from 'express-validator';
import { Request, Response } from 'express';
import { Error } from 'mongoose';
import { UserReadDto } from '../../Dtos/user-read.dto';
import { UserCreateDto } from '../../Dtos/user-create.dto';
import UserChangeDto from '../../Dtos/user-change.dto';

export default class UserController {
    searchUser = async (req: Request, res: Response) => {
        let searchValue = req.query.searchValue as string;
        searchValue = searchValue.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
        const regex = new RegExp(searchValue, 'i');
        try {
            const users = await UserModel.find({ $or: [{ username: { $regex: regex } }, { email: { $regex: regex } }] }).limit(6);
            return res.status(200).json({ status: 200, data: users });
        } catch {
            return res.status(500).json({ status: 500, data: null, error: "Internal Server Errror" });
        }
    }

    findUserById = async (req: Request, res: Response) => {
        const userId = req.query.userId;
        try {
            const user = await UserModel.findById(userId);
            return res.status(200).json({ status: 200, data: UserReadDto.fromUser(user) });
        } catch {
            return res.status(500).json({ status: 500, data: null, error: "Internal Server Errror" });
        }
    }

    findUserByPeerId = async (req: Request, res: Response) => {
        const peerId = req.query.peerId;
        try {
            const user = await UserModel.findOne({ peerId: peerId.toString() });
            return res.status(200).json({ status: 200, data: UserReadDto.fromUser(user) });
        } catch {
            return res.status(500).json({ status: 500, data: null, error: "Internal Server Errror" });
        }
    }


    register = async (req: Request, res: Response) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ status: 400, errors: errors.array() });
        }
        const userCreate = UserCreateDto.fromUser(req.body);
        try {
            await UserModel.create(userCreate);
            return res.status(200).json({ status: 200, data: null });
        } catch (err) {
            return res.status(500).json({ status: 500, data: null, error: "Internal Server Errror" });
        }
    }

    getDetail = async (req: Request, res: Response) => {
        const userId = req.userData.userId;
        try {
            const user = await UserModel.findById(userId);
            const userRead = UserReadDto.fromUser(user);
            return res.status(200).json({ status: 200, data: userRead });
        } catch (err) {
            return res.status(500).json({ status: 500, data: null, error: "Internal Server Errror" });
        }
    }

    changeInfor = async (req: Request, res: Response) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ status: 400, errors: errors.array() });
        }
        const userId = req.userData.userId;
        const userChange = UserChangeDto.fromUser(req.body);
        try {
            const user = await UserModel.findByIdAndUpdate(userId, { ...userChange }, { new: true });
            return res.status(200).json({ status: 200, data: user })
        } catch (err) {
            return res.status(500).json({ status: 500, data: null, error: "Internal Server Errror" });
        }

    }

    changePassword = async (req: Request, res: Response) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ status: 400, errors: errors.array() });
        }

        const userId = req.userData.userId;
        const password = req.body.password;
        try {
            const user = await UserModel.findByIdAndUpdate(userId, { password: cryptoJS.SHA256(password).toString() });
            return res.status(200).json({ status: 200, data: user })
        } catch (err) {
            return res.status(500).json({ status: 500, data: null, error: "Internal Server Errror" });
        }
    }
}