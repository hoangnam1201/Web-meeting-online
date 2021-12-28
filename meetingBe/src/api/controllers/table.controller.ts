import { Request, Response } from "express";
import { validationResult } from "express-validator";
import mongoose from "mongoose";
import { TableCreateDto } from "../../Dtos/table-create.dto";
import tableModel, { Table } from "../../models/table.model";
import roomModel from "../../models/room.model";
import { match } from "assert";
export default class TablerController {

    createTable(req: Request, res: Response) {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ status: 400, errors: errors.array() });
        }
        const tableCreate = TableCreateDto.fromTable(req.body);
        tableModel.create(tableCreate, (err: Error) => {
            if (err) {
                return res.status(400).json({ status: 400, errors: [{ msg: err }] })
            }
            return res.status(200).json({ status: 200, data: null });
        })
    }

    saveMember(req: Request, res: Response) {
        const { roomId } = req.params;
        tableModel.updateMany({ room: new mongoose.Types.ObjectId(roomId) as any }, [{
            $set: { members: '$users' }
        }]).then(() => {
            return res.status(200).json({ status: 200, data: null });
        }).catch((err: any) => {
            console.log(err);
            return res.status(500).json({ status: 500, data: 'Internal Server Error' });
        })
    }

    deleteTable(req: Request, res: Response) {
        const tableId = req.params.tableId;
        tableModel.deleteOne({ _id: tableId }, {}, (err) => {
            if (err) {
                return res.status(400).json({ status: 400, errors: [{ msg: err }] })
            }
            return res.status(200).json({ status: 200, data: null });
        })
    }

    addUser(req: Request, res: Response) {
        const tableId = req.params.tableId;
        const userId = req.body.userId;
        tableModel.updateOne({ _id: tableId }, { $addToSet: { members: userId } }, {}, (err: Error) => {
            if (err) {
                return res.status(400).json({ status: 400, errors: [{ msg: err }] })
            }
            return res.status(200).json({ status: 200, data: null });
        })
    }

    removeUser(req: Request, res: Response) {
        const tableId = req.params.tableId;
        const userId = req.body.userId;

        tableModel.updateOne({ _id: tableId }, { $pull: { members: userId } }, {}, (err: Error) => {
            if (err) {
                return res.status(400).json({ status: 400, errors: [{ msg: err }] })
            }
            return res.status(200).json({ status: 200, data: null });
        })
    }

    getTable(req: Request, res: Response) {
        const tableId = req.params.tableId;
        tableModel.findById(tableId).populate({ path: 'members', select: 'name username _id email' })
            .then((table: Table) => {
                return res.status(200).json({ status: 200, data: table })
            }).catch((err: Error) => {
                return res.status(400).json({ status: 400, errors: [{ msg: err }] })
            })
    }

    getTablesInRoom(req: Request, res: Response) {
        const roomId = req.params.roomId;
        tableModel.find({ room: new mongoose.Types.ObjectId(roomId) as any }, (err: any, tables: Table) => {
            if (err) {
                return res.status(400).json({ err })
            }
            return res.status(200).json({ status: 200, data: tables });
        })
    }

    searchMember(req: Request, res: Response) {
        const roomId = req.params.roomId;
        roomModel.aggregate()
            .match({ _id: new mongoose.Types.ObjectId(roomId) as any })
            .lookup({
                from: 'tables',
                let: { id: '$_id' },
                pipeline: [
                    { $match: { $expr: { $eq: ['$$id', '$room'] } } },
                    { $unwind: '$members' },
                    { $group: { _id: '$room', members: { $addToSet: '$members' } } }
                ],
                as: 'table',
            })
            .unwind('table', 'members')
            .match({ $expr: { $not: { $in: ['$members', '$table.members'] } } })
            .group({ _id: '$_id', members: { $addToSet: '$members' } })
            .lookup({
                from: 'users',
                let: { mb: '$members' },
                pipeline: [
                    { $match: { $expr: { $in: ['$_id', '$$mb'] } } },
                    { $project: { '_id': 1, 'name': 1, 'username': 1, 'email': 1 } }
                ],
                as: 'members'
            })
            .then((items: any) => {
                res.status(200).json({ data: items[0] ? items[0].members : [] })
            })
    }

    getMemberTables(req: Request, res: Response) {
        const roomId = req.params.roomId;
        const { limit = '10', page = '0' } = req.query;
        const ltemp = parseInt(limit as string);
        const ptemp = parseInt(page as string);

        tableModel.aggregate()
            .match({ room: new mongoose.Types.ObjectId(roomId) as any })
            .lookup({
                from: 'users',
                let: { mb: '$members' },
                pipeline: [
                    { $match: { $expr: { $in: ['$_id', '$$mb'] } } },
                    { $project: { '_id': 1, 'name': 1, 'username': 1, 'email': 1 } }
                ],
                as: 'members'
            })
            .facet({
                count: [{ $count: 'count' }],
                results: [{ $skip: ltemp * ptemp }, { $limit: ltemp }]
            })
            .addFields({
                count: { $arrayElemAt: ['$count.count', 0] }
            })
            .then(items => {
                res.status(200).json({ data: items[0], status: 200 })
            })
            .catch(err => {
                res.status(500).json({ error: 'Interal Server Error', status: 200 })
            })
    }

}