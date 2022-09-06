import { Request, Response } from "express";
import { validationResult } from "express-validator";
import { TableCreateDto } from "../../Dtos/table-create.dto";
import TableService from "../../services/table.service";

export default () => {
  const tableService = TableService();

  const createTable = async (req: Request, res: Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ status: 400, errors: errors.array() });
    }
    try {
      const tableCreate = TableCreateDto.fromTable(req.body);
      await tableService.create(tableCreate);
      return res.status(200).json({ status: 200, data: null });
    } catch {
      return res
        .status(500)
        .json({ status: 500, msg: "Enternal Server Error" });
    }
  };

  const saveMember = async (req: Request, res: Response) => {
    const { roomId } = req.params;
    try {
      await tableService.saveMember(roomId);
      return res.status(200).json({ status: 200, data: null });
    } catch {
      return res
        .status(500)
        .json({ status: 500, msg: "Internal Server Error" });
    }
  };

  const deleteTable = async (req: Request, res: Response) => {
    const tableId = req.params.tableId;
    try {
      await tableService.removeTable(tableId);
      return res.status(200).json({ status: 200, data: null });
    } catch {
      return res
        .status(500)
        .json({ status: 500, msg: "Internal Server Error" });
    }
  };

  const addUser = async (req: Request, res: Response) => {
    const tableId = req.params.tableId;
    const userId = req.body.userId;
    try {
      await tableService.addUser(tableId, userId);
      return res.status(200).json({ status: 200, data: null });
    } catch {
      return res
        .status(500)
        .json({ status: 500, msg: "Internal Server Error" });
    }
  };

  const removeUser = async (req: Request, res: Response) => {
    const tableId = req.params.tableId;
    const userId = req.body.userId;
    try {
      await tableService.removeUser(tableId, userId);
      return res.status(200).json({ status: 200, data: null });
    } catch {
      return res
        .status(500)
        .json({ status: 500, msg: "Internal Server Error" });
    }
  };

  const getTable = async (req: Request, res: Response) => {
    const tableId = req.params.tableId;
    try {
      const table = tableService.getDetail(tableId);
      return res.status(200).json({ status: 200, data: table });
    } catch {
      return res
        .status(500)
        .json({ status: 500, msg: "Internal Server Error" });
    }
  };

  const getTablesInRoom = async (req: Request, res: Response) => {
    const roomId = req.params.roomId;
    try {
      const tables = await tableService.getTablesInRoom(roomId);
      return res.status(200).json({ status: 200, data: tables });
    } catch {
      return res
        .status(500)
        .json({ status: 500, msg: "Internal Server Error" });
    }
  };

  const getTablesInRoomAndFloor = async (req: Request, res: Response) => {
    const roomId = req.params.roomId;
    const floor = req.query.floor;
    try {
      const tables = await tableService.getTablesByRoomAndFloor(
        roomId,
        floor.toString()
      );
      return res.status(200).json({ status: 200, data: tables });
    } catch {
      return res
        .status(500)
        .json({ status: 500, msg: "Internal Server Error" });
    }
  };

  const searchMember = async (req: Request, res: Response) => {
    const roomId = req.params.roomId;
    try {
      const items = await tableService.searchMember(roomId);
      res.status(200).json({ data: items[0] ? items[0].members : [] });
    } catch {}
  };

  const getMemberTables = async (req: Request, res: Response) => {
    const roomId = req.params.roomId;
    const { limit = "10", page = "0" } = req.query;
    const ltemp = parseInt(limit as string);
    const ptemp = parseInt(page as string);
    try {
      const items = await tableService.getMemberTables(roomId, ltemp, ptemp);
      res.status(200).json({ data: items[0], status: 200 });
    } catch {
      res.status(500).json({ error: "Interal Server Error", status: 200 });
    }
  };

  return {
    createTable,
    saveMember,
    deleteTable,
    getMemberTables,
    searchMember,
    removeUser,
    addUser,
    getTable,
    getTablesInRoom,
    getTablesInRoomAndFloor,
  };
};
