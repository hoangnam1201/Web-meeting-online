import { Request, Response } from "express";
import { validationResult } from "express-validator";
import mongoose from "mongoose";
import { TableCreateDto } from "../../Dtos/table-create.dto";
import tableModel, { Table } from "../../models/table.model";

const getTableById = (id: string, res: Response) => {
    tableModel.findById(id).populate('users').then((table: Table) => {
        return res.status(200).json({ status: 200, data: table })
    }).catch((err: Error) => {
        return res.status(400).json({ status: 400, errors: [{ msg: err }] })
    })
}

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

    deleteTable(req: Request, res: Response) {
        const tableId = req.params.tableId;
        console.log(tableId);
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
        tableModel.updateOne({ _id: tableId }, { $push: { users: userId } }, {}, (err: Error) => {
            if (err) {
                return res.status(400).json({ status: 400, errors: [{ msg: err }] })
            }
            return res.status(200).json({ status: 200, data: null });
        })
    }

    removeUser(req: Request, res: Response) {
        const tableId = req.params.tableId;
        const userId = req.body.userId;

        tableModel.updateOne({ _id: tableId }, { $pull: { users: userId } }, {}, (err: Error) => {
            if (err) {
                return res.status(400).json({ status: 400, errors: [{ msg: err }] })
            }
            return res.status(200).json({ status: 200, data: null });
        })
    }

    getTable(req: Request, res: Response) {
        const tableId = req.params.tableId;
        return getTableById(tableId, res);
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
}