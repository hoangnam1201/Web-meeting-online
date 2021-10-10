import { Request, Response } from 'express';
import { validationResult } from 'express-validator';
import mongoose from 'mongoose';
import { RoomCreateDto } from '../../Dtos/room-create.dto';
import { RoomReadDetailDto } from '../../Dtos/room-detail.dto';
import { RoomReadDto } from '../../Dtos/room-read.dto';
import roomModel, { Room } from '../../models/room.model';
import userModel, { User } from '../../models/user.model';
import PageDataService from '../../services/pageData.service';

export default class RoomController {
    createRoom = (req: Request, res: Response) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ status: 400, ...errors });
        }

        const userId = req.userData.userId;
        const room: Room = { ...req.body, owner: userId };
        const roomCreate = RoomCreateDto.fromRoom(room);
        roomModel.create(roomCreate, (err: Error) => {
            if (err) {
                return res.status(400).json({
                    status: 400,
                    error: [{
                        mgs: err
                    }]
                })
            }
            return res.status(200).json({ status: 200, data: null });
        })
    }

    deleteRoom = (req: Request, res: Response) => {
        const roomId = req.params.roomId;
        roomModel.findOneAndDelete({ _id: roomId }).then((room: Room) => {
            userModel.updateMany({ _id: { $in: room.members } }, { $pull: { invitedRooms: roomId } }).then(() => {
                return res.status(200).json({ status: 200, data: null });
            }).catch((err: any) => {
                return res.status(400).json({ status: 400, errors: [{ msg: err }] });
            })
        })
    }

    changeRoom = (req: Request, res: Response) => {
        const roomId = req.params.roomId;
        const room = req.body
        const roomChange = RoomCreateDto.fromRoom(room);
        roomModel.updateOne({ _id: roomId }, { ...roomChange }).exec((err: any) => {
            if (err) {
                return res.status(400).json({ status: 400, errors: [{ mgs: err }] });
            }
            return res.status(200).json({ status: 200, data: null });
        })
    }

    getRoomById = (req: Request, res: Response) => {
        const roomId = req.params.roomId;
        roomModel.findById(roomId).populate('requests').populate('members').populate('owner').then((room: Room) => {
            const roomDetail = RoomReadDetailDto.fromRoom(room)
            return res.status(200).json({ status: 200, data: roomDetail });
        }).catch((err: Error) => {
            return res.status(400).json({ status: 400, errors: [{ mgs: err }] });
        })

    }

    getOwnedRoom = (req: Request, res: Response) => {
        const userId = req.userData.userId;
        if (!req.query.pageIndex && !req.query.pageSize) {
            return roomModel.find({ owner: new mongoose.Types.ObjectId(userId) as any }).populate('owner').exec((err: any, rooms: Room[]) => {
                if (err) {
                    return res.status(400).json({ status: 400, errors: [{ mgs: err }] });
                }
                const roomReads = RoomReadDto.fromArray(rooms);
                return res.status(200).json({ status: 200, data: roomReads });
            })
        }

        const pageIndex = parseInt(req.query.pageIndex as string, 10) || 0;
        const pageSize = parseInt(req.query.pageSize as string, 10) || 10;
        roomModel.find({ owner: new mongoose.Types.ObjectId(userId) as any }).populate('owner')
            .sort({ _id: -1 })
            .skip(pageIndex * pageSize)
            .limit(pageSize)
            .then((rooms: Room[]) => {
                roomModel.find({ owner: new mongoose.Types.ObjectId(userId) as any }).countDocuments().exec((err: any, count: number) => {
                    if (err) {
                        return res.status(400).json({ status: 400, errors: [{ mgs: err }] });
                    }
                    const roomReads = RoomReadDto.fromArray(rooms);
                    const pageData = PageDataService.getPageData(roomReads, count, pageIndex, pageSize);
                    return res.status(200).json({ status: 200, data: pageData });
                })
            }).catch((err: any) => {
                return res.status(400).json({ status: 400, errors: [{ mgs: err }] });
            })
    }

    getInvitedRoom = (req: Request, res: Response) => {
        const userId = req.userData.userId;

        if (!req.query.pageIndex && !req.query.pageSize) {
            return userModel.findById(userId).populate([{
                path: 'invitedRooms',
                populate: {
                    path: 'owner'
                }
            }]).exec((err: any, user: User) => {
                if (err) {
                    return res.status(400).json({ status: 400, errors: [{ mgs: err }] });
                }
                const roomReads = RoomReadDto.fromArray(user.invitedRooms as Room[]);
                return res.status(200).json({ status: 200, data: roomReads });
            })
        }

        const pageIndex = parseInt(req.query.pageIndex as string, 10) || 0;
        const pageSize = parseInt(req.query.pageSize as string, 10) || 10;
        userModel.findById(userId).populate([{
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
            .then((user: User) => {
                userModel.findById(userId).exec((err: any, userCount: User) => {
                    if (err) {
                        return res.status(400).json({ status: 400, errors: [{ mgs: err }] });
                    }
                    const roomReads = RoomReadDto.fromArray(user.invitedRooms as Room[]);
                    const pageData = PageDataService.getPageData(roomReads, userCount.invitedRooms.length, pageIndex, pageSize);
                    return res.status(200).json({ status: 200, data: pageData });
                })
            }).catch((err: any) => {
                return res.status(400).json({ status: 400, errors: [{ mgs: err }] });
            })
    }

    addMember = (req: Request, res: Response) => {
        const roomId = req.params.roomId;
        const userId = req.body.userId;
        roomModel.findOneAndUpdate({ _id: roomId }, { $push: { members: userId } }).then((room: Room) => {
            userModel.updateOne({ _id: userId }, { $push: { invitedRooms: roomId } }).then(() => {
                return res.status(200).json({ status: 200, data: null });
            }).catch((err: Error) => {
                return res.status(400).json({ status: 400, errors: [{ mgs: err }] });
            })
        }).catch((err: Error) => {
            return res.status(400).json({ status: 400, errors: [{ mgs: err }] });
        })
    }

    addMembers = (req: Request, res: Response) => {
        const roomId = req.params.roomId;
        const userIds = req.body.userIds;
        roomModel.findOneAndUpdate({ _id: roomId }, {
            $push: {
                members: {
                    $each: userIds
                }
            }
        }).then((room: Room) => {
            userModel.updateMany({ _id: { $in: userIds } }, {
                $push: {
                    invitedRooms: room._id
                }
            }).then(() => {
                return res.status(200).json({ status: 200, data: null });
            }).catch((err: any) => {
                return res.status(400).json({ status: 400, errors: [{ msg: err }] });
            })
        }).catch((err: any) => {
            return res.status(400).json({ status: 400, errors: [{ msg: err }] });
        })
    }

    removeMembers = (req: Request, res: Response) => {
        const roomId = req.params.roomId;
        const userIds = req.body.userIds;
        roomModel.findOneAndUpdate({ _id: roomId }, {
            $pull: {
                members: {
                    $each: userIds
                }
            }
        }).then((room: Room) => {
            userModel.updateMany({ _id: { $in: userIds } }, {
                $pull: {
                    invitedRooms: room._id
                }
            }).then(() => {
                return res.status(200).json({ status: 200, data: null });
            }).catch((err: any) => {
                return res.status(400).json({ status: 400, errors: [{ msg: err }] });
            })
        }).catch((err: any) => {
            return res.status(400).json({ status: 400, errors: [{ msg: err }] });
        })
    }

    removeMember = (req: Request, res: Response) => {
        const roomId = req.params.roomId;
        const userId = req.body.userId;
        roomModel.updateOne({ _id: roomId }, { $pull: { members: userId } }).then(() => {
            userModel.updateOne({ _id: userId }, { $pull: { invitedRooms: roomId } }).then(() => {
                return res.status(200).json({ status: 200, data: null });
            }).catch((err: Error) => {
                return res.status(400).json({ status: 400, errors: [{ mgs: err }] });
            })
        }).catch((err: any) => {
            return res.status(400).json({ status: 400, errors: [{ mgs: err }] });
        })
    }
}
