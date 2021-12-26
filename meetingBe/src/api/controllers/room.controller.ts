import { Request, Response } from 'express';
import { validationResult } from 'express-validator';
import mongoose from 'mongoose';
import { NotificationCreateDto } from '../../Dtos/notification-create.dto';
import { RoomCreateDto } from '../../Dtos/room-create.dto';
import { RoomReadDetailDto } from '../../Dtos/room-detail.dto';
import { RoomReadDto } from '../../Dtos/room-read.dto';
import notificationModel from '../../models/notifications.model';
import roomModel, { Room } from '../../models/room.model';
import userModel, { User } from '../../models/user.model';
import PageDataService from '../../services/pageData.service';

export default class RoomController {
    createRoom = async (req: Request, res: Response) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ status: 400, errors: errors.array() });
        }

        const userId = req.userData.userId;
        const room: Room = { ...req.body, owner: userId };
        const roomCreate = RoomCreateDto.fromRoom(room);
        try {
            await roomModel.create(roomCreate)
            return res.status(200).json({ status: 200, data: null });
        } catch (err) {
            return res.status(500).json({
                status: 500,
                err: 'Internal Server Error'
            })
        }
    }

    deleteRoom = async (req: Request, res: Response) => {
        const roomId = req.params.roomId;
        try {
            const room = await roomModel.findOneAndDelete({ _id: roomId });
            await userModel.updateMany({ _id: { $in: room.members } }, { $pull: { invitedRooms: roomId } });
            return res.status(200).json({ status: 200, data: null });
        } catch (err) {
            return res.status(500).json({
                status: 500,
                error: 'Internal Server Error'
            })
        }
    }

    changeRoom = async (req: Request, res: Response) => {
        const roomId = req.params.roomId;
        const room = req.body
        const roomChange = RoomCreateDto.fromRoom(room);
        try {
            await roomModel.updateOne({ _id: roomId }, { ...roomChange });
            return res.status(200).json({ status: 200, data: null });
        } catch (err) {
            return res.status(500).json({ status: 500, error: 'Internal Server Error'});
        }
    }

    getRoomById = async (req: Request, res: Response) => {
        const roomId = req.params.roomId;
        try {
            const room = await roomModel.findById(roomId)
                .populate('members')
                .populate('owner');
            const roomDetail = RoomReadDetailDto.fromRoom(room)
            return res.status(200).json({ status: 200, data: roomDetail });
        } catch (err) {
            console.log(err)
            return res.status(500).json({ status: 500, error: 'Internal Server Error'});
        }

    }

    getOwnedRoom = async (req: Request, res: Response) => {
        const userId = req.userData.userId;
        try {
            if (!req.query.pageIndex && !req.query.pageSize) {
                const rooms = await roomModel.find({ owner: new mongoose.Types.ObjectId(userId) as any }).populate('owner');
                const roomReads = RoomReadDto.fromArray(rooms);
                return res.status(200).json({ status: 200, data: roomReads });
            }

            const pageIndex = parseInt(req.query.pageIndex as string, 10) || 0;
            const pageSize = parseInt(req.query.pageSize as string, 10) || 10;

            const roomData = await roomModel.find({ owner: new mongoose.Types.ObjectId(userId) as any }).populate('owner')
                .sort({ _id: -1 })
                .skip(pageIndex * pageSize)
                .limit(pageSize);
            const roomCount = await roomModel.find({ owner: new mongoose.Types.ObjectId(userId) as any }).countDocuments();
            const roomDataReads = RoomReadDto.fromArray(roomData);
            const pageData = PageDataService.getPageData(roomDataReads, roomCount, pageIndex, pageSize);
            return res.status(200).json({ status: 200, data: pageData });
        } catch (err) {
            return res.status(500).json({ status: 500, error: 'Internal Server Error'});
        }
    }

    getInvitedRoom = async (req: Request, res: Response) => {
        const userId = req.userData.userId;
        try {
            if (!req.query.pageIndex && !req.query.pageSize) {
                const user = await userModel.findById(userId).populate([{
                    path: 'invitedRooms',
                    populate: {
                        path: 'owner'
                    }
                }])
                const readRooms = RoomReadDto.fromArray(user.invitedRooms as Room[]);
                return res.status(200).json({ status: 200, data: readRooms });
            }

            const pageIndex = parseInt(req.query.pageIndex as string, 10) || 0;
            const pageSize = parseInt(req.query.pageSize as string, 10) || 10;

            const userData = await userModel.findById(userId).populate([{
                path: 'invitedRooms',
                populate: {
                    path: 'owner'
                },
                options: {
                    sort: { _id: -1 },
                    skip: pageIndex * pageSize,
                    limit: pageSize
                }
            }])
            const userCount = await userModel.findById(userId);
            const roomReads = RoomReadDto.fromArray(userData.invitedRooms as Room[]);
            const pageData = PageDataService.getPageData(roomReads, userCount.invitedRooms.length, pageIndex, pageSize);
            return res.status(200).json({ status: 200, data: pageData });
        } catch (err) {
            return res.status(500).json({ status: 500, error: 'Internal Server Error'});
        }
    }

    addMember = async (req: Request, res: Response) => {
        const roomId = req.params.roomId;
        const userId = req.body.userId;
        const authId = req.userData.userId;
        try {
            const room = await roomModel.findOneAndUpdate({ _id: roomId }, { $addToSet: { members: userId } });
            await userModel.updateOne({ _id: userId }, { $addToSet: { invitedRooms: roomId } });
            res.status(200).json({ status: 200, data: null });

            const msg = `You are invited to class ${room.name}`
            const notificationCreate = NotificationCreateDto.fromUserNotification(msg, authId, userId);
            const item = await notificationModel.create(notificationCreate);
            const notification = await notificationModel.find(item).populate('fromUser');
            req.app.io.to(userId).emit('notification', notification);

        } catch (err) {
            return res.status(500).json({ status: 500, error: 'Internal Server Error'});
        }

    }

    addMembers = async (req: Request, res: Response) => {
        const roomId = req.params.roomId;
        const userIds = req.body.userIds;
        try {

            const room = await roomModel.findOneAndUpdate({ _id: roomId }, {
                $addToSet: {
                    members: {
                        $each: userIds
                    }
                }
            })
            await userModel.updateMany({ _id: { $in: userIds } }, {
                $addToSet: {
                    invitedRooms: room._id
                }
            })
            res.status(200).json({ status: 200, data: null });

        } catch (err) {
            return res.status(500).json({ status: 500, error: 'Internal Server Error'});
        }

    }

    removeMembers = async (req: Request, res: Response) => {
        const roomId = req.params.roomId;
        const userIds = req.body.userIds;
        try {
            const room = await roomModel.findOneAndUpdate({ _id: roomId }, {
                $pull: {
                    members: {
                        $each: userIds
                    }
                }
            })
            await userModel.updateMany({ _id: { $in: userIds } }, {
                $pull: {
                    invitedRooms: room._id
                }
            })
            return res.status(200).json({ status: 200, data: null });
        } catch (err) {
            return res.status(500).json({ status: 500, error: 'Internal Server Error'});
        }

    }

    removeMember = async (req: Request, res: Response) => {
        const roomId = req.params.roomId;
        const userId = req.query.userId;
        try {
            await roomModel.updateOne({ _id: roomId }, { $pull: { members: userId } });
            await userModel.updateOne({ _id: userId }, { $pull: { invitedRooms: roomId } });
            return res.status(200).json({ status: 200, data: null });
        } catch (err) {
            return res.status(500).json({ status: 500, error: 'Internal Server Error'});
        }
    }
}
