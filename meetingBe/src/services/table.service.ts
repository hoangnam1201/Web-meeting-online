import mongoose, { ObjectId } from "mongoose";
import { TableCreateDto } from "../Dtos/table-create.dto";
import { TableUpdateDto } from "../Dtos/table-update.dto";
import roomModel from "../models/room.model";
import tableModel from "../models/table.model";

export default () => {
  const create = (tableData: TableCreateDto | TableCreateDto[]) => {
    return tableModel.create(tableData);
  };

  const saveMember = (roomId: string) => {
    return tableModel.updateMany({ room: roomId }, [
      {
        $set: { members: "$users" },
      },
    ]);
  };

  const update = (ids: string[] | string, TableData: TableUpdateDto) => {
    return tableModel.updateMany({ _id: { $in: ids } }, TableData);
  };

  const removeTable = (tableId: string) => {
    return tableModel.deleteOne({ _id: tableId });
  };

  const removeTables = (tableIds: string[]) => {
    return tableModel.deleteMany({ _id: { $in: tableIds } });
  };

  const addUser = (tableId: string, userId: ObjectId) => {
    return tableModel.updateOne(
      { _id: tableId },
      { $addToSet: { members: userId } }
    );
  };

  const removeUser = (tableId: string, userId: ObjectId) => {
    return tableModel.updateOne(
      { _id: tableId },
      { $pull: { members: userId } }
    );
  };

  const getDetail = (tableId: string) => {
    return tableModel
      .findById(tableId)
      .populate({ path: "members", select: "name username _id email" });
  };

  const getById = (tableId: string) => {
    return tableModel.findById(tableId);
  };

  const getTablesInRoom = (roomId: string) => {
    return tableModel.find({
      room: roomId,
    });
  };

  const getTablesByRoomAndFloor = (
    roomId: string | ObjectId,
    floorId: string | ObjectId
  ) => {
    return tableModel.find({ room: roomId, floor: floorId }).populate("users");
  };

  const addJoiner = async (
    roomId: string,
    tableId: string,
    userId: string | ObjectId
  ) => {
    await tableModel.updateMany({ room: roomId }, { $pull: { users: userId } });
    return tableModel.updateOne(
      { _id: tableId },
      { $addToSet: { users: userId as ObjectId } }
    );
  };

  const findAndClearJoiner = async (roomId: string) => {
    await tableModel.updateMany({ room: roomId }, { users: [] });
    return tableModel.find({ room: roomId }).populate("users");
  };

  const removeJoiner = (tableId: string, userId: string) => {
    return tableModel.findByIdAndUpdate(
      tableId,
      { $pull: { users: userId } },
      { new: true }
    );
  };

  const searchMember = (roomId: string) => {
    return roomModel
      .aggregate()
      .match({ _id: new mongoose.Types.ObjectId(roomId) })
      .lookup({
        from: "tables",
        let: { id: "$_id" },
        pipeline: [
          { $match: { $expr: { $eq: ["$$id", "$room"] } } },
          {
            $unwind: {
              path: "$members",
              preserveNullAndEmptyArrays: true,
            },
          },
          { $group: { _id: "$room", members: { $addToSet: "$members" } } },
        ],
        as: "table",
      })
      .unwind(
        {
          path: "$table",
          preserveNullAndEmptyArrays: true,
        },
        {
          path: "$members",
          preserveNullAndEmptyArrays: true,
        }
      )
      .match({ $expr: { $not: { $in: ["$members", "$table.members"] } } })
      .group({
        _id: "$_id",
        members: { $addToSet: "$members" },
        table: { $push: "$table" },
      })
      .lookup({
        from: "users",
        let: { mb: "$members" },
        pipeline: [
          { $match: { $expr: { $in: ["$_id", "$$mb"] } } },
          { $project: { _id: 1, name: 1, username: 1, email: 1 } },
        ],
        as: "members",
      });
  };

  const getMemberTables = (roomId: string, limit: number, page: number) => {
    return tableModel
      .aggregate()
      .match({ room: new mongoose.Types.ObjectId(roomId) })
      .lookup({
        from: "users",
        let: { mb: "$members" },
        pipeline: [
          { $match: { $expr: { $in: ["$_id", "$$mb"] } } },
          { $project: { _id: 1, name: 1, username: 1, email: 1 } },
        ],
        as: "members",
      })
      .facet({
        count: [{ $count: "count" }],
        results: [{ $skip: limit * page }, { $limit: limit }],
      })
      .addFields({
        count: { $arrayElemAt: ["$count.count", 0] },
      });
  };

  const getAllMemberTables = (roomId: string) => {
    return tableModel
      .find({ room: roomId })
      .select("name")
      .populate({ path: "members" });
  };

  const removeAllTableInRoom = (roomId: string) => {
    return tableModel.remove({ room: roomId });
  };

  return {
    removeAllTableInRoom,
    findAndClearJoiner,
    getById,
    create,
    update,
    addJoiner,
    removeJoiner,
    getTablesByRoomAndFloor,
    getMemberTables,
    saveMember,
    removeTable,
    removeTables,
    addUser,
    removeUser,
    getDetail,
    getTablesInRoom,
    getAllMemberTables,
    searchMember,
  };
};
