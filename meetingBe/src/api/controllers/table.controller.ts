import { Request, Response } from "express";
import { validationResult } from "express-validator";
import { TableCreateDto } from "../../Dtos/table-create.dto";
import { TableReadCSVDto } from "../../Dtos/table-read-csv.dto";
import { TableUpdateDto } from "../../Dtos/table-update.dto";
import { FileRequest } from "../../interfaces/fileRequest";
import FileService from "../../services/file.service";
import RoomService from "../../services/room.service";
import TableService from "../../services/table.service";

export default () => {
  const tableService = TableService();
  const fileService = FileService();
  const roomService = RoomService();

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

  const createTables = async (req: Request, res: Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ status: 400, errors: errors.array() });
    }

    try {
      const tableCreate = TableCreateDto.fromArray(req.body);
      await tableService.create(tableCreate);
      return res.status(200).json({ status: 200, data: null });
    } catch {
      return res
        .status(500)
        .json({ status: 500, msg: "Enternal Server Error" });
    }
  };

  const updateTable = async (req: Request, res: Response) => {
    const errors = validationResult(req);
    const { ids } = req.body;
    if (!errors.isEmpty()) {
      return res.status(400).json({ status: 400, errors: errors.array() });
    }
    try {
      const tableCreate = TableUpdateDto.fromTable(req.body);
      await tableService.update(ids, tableCreate);
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

  const deleteTables = async (req: Request, res: Response) => {
    const tableIds = req.body;
    try {
      await tableService.removeTables(tableIds);
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
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ status: 400, errors: errors.array() });
    }

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
      res.status(500).json({ msg: "Interal Server Error", status: 200 });
    }
  };

  const addMembersByFile = async (req: FileRequest, res: Response) => {
    const roomId = req.params.roomId;
    const file = req.files?.importFile;

    try {
      const room = await roomService.findById(roomId);
      if (!room)
        return res.status(400).json({ status: 400, msg: "not found room" });
      if (!room.floors.length)
        return res
          .status(400)
          .json({ status: 400, msg: "room have to leatest one floor" });

      await tableService.removeAllTableInRoom(roomId);
      const data = fileService.excelToJson(file.data);
      const tables = data.reduce(
        (total, current: { group_table: string; id: string }) => {
          total[current.group_table] = total[current.group_table] || [];
          total[current.group_table].push(current.id);
          return total;
        },
        Object.create(null)
      );
      const AddTables = Object.keys(tables).reduce((data, key: string) => {
        const members = tables[key];
        const table = {
          name: key,
          numberOfSeat: members.length < 9 ? members.length : 8,
          floor: room.floors[0],
          room: roomId,
          members,
        };
        data.push(table);
        return data;
      }, []);
      await tableService.create(AddTables);
      res.status(200).json({ status: 200, data: null });
    } catch (e) {
      console.log(e);
      res.status(500).json({ msg: "Interal Server Error", status: 200 });
    }
  };

  const exportToCSV = async (req: Request, res: Response) => {
    const roomId = req.params.roomId;
    try {
      const tables = await tableService.getAllMemberTables(roomId);
      const tableRead = TableReadCSVDto.fromArray(tables);
      const stream = fileService.jsonToExcel(tableRead.data, null);

      //response
      res.setHeader(
        "Content-disposition",
        "attachment; filename=" + `group-${roomId}.xlsx`
      );
      res.setHeader(
        "Content-type",
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
      );

      stream.pipe(res);
    } catch (err) {
      console.log(err);
      res.status(500).json({ msg: "Interal Server Error", status: 200 });
    }
  };

  return {
    addMembersByFile,
    createTable,
    createTables,
    saveMember,
    deleteTable,
    deleteTables,
    updateTable,
    getMemberTables,
    searchMember,
    removeUser,
    addUser,
    getTable,
    getTablesInRoom,
    getTablesInRoomAndFloor,
    exportToCSV,
  };
};
