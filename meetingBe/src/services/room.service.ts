import { RoomCreateDto } from "../Dtos/room-create.dto";
import roomModel from "../models/room.model";
import userModel from "../models/user.model";
import mongoose, { ObjectId as ObjectID } from "mongoose";
import { ObjectId } from "mongodb";
import tableModel from "../models/table.model";
import messageModel from "../models/message.model";

export default () => {
  const findById = (id: string) => {
    return roomModel.findById(id);
  };

  const create = (roomData: RoomCreateDto) => {
    return roomModel.create({ ...roomData, floors: [new ObjectId()] });
  };

  const deleteRoom = async (roomId: string) => {
    await messageModel.deleteMany({ room: roomId });
    await tableModel.deleteMany({ room: roomId });
    const room = await roomModel.findOneAndDelete({ _id: roomId });
    return userModel.updateMany(
      { _id: { $in: room.members } },
      { $pull: { invitedRooms: roomId } }
    );
  };

  const changeRoomInfo = (roomId: string, roomData: RoomCreateDto) => {
    return roomModel.updateOne({ _id: roomId }, roomData);
  };

  const inscreaseFloors = (roomId: string) => {
    return roomModel.updateOne(
      { _id: roomId },
      { $push: { floors: new ObjectId() } }
    );
  };

  const findOneAndRemoveJoiner = (roomId: string, userId: string) => {
    return roomModel
      .findOneAndUpdate(
        { _id: roomId },
        { $pull: { joiners: userId } },
        { timestamps: true, new: true }
      )
      .populate("joiners");
  };

  const findOneAndAddJoiner = (roomId: string, userId: string | ObjectID) => {
    return roomModel
      .findOneAndUpdate(
        { _id: roomId },
        { $addToSet: { joiners: userId as ObjectID } },
        { timestamps: true, new: true }
      )
      .populate("joiners");
  };

  const findOneAndUpdatePresent = (roomId: string, isPresent: boolean) => {
    return roomModel.findByIdAndUpdate(
      roomId,
      { isPresent: isPresent },
      { new: true }
    );
  };

  const deleteFloor = async (roomId: string, floorId: string) => {
    await tableModel.deleteMany({ room: roomId, floor: floorId });
    return roomModel.updateOne({ _id: roomId }, { $pull: { floors: floorId } });
  };

  const getDetail = (roomId: string) => {
    return roomModel
      .findById({ _id: roomId })
      .populate("members")
      .populate("owner");
  };

  const getOwnedRooms = (userId: string) => {
    return roomModel.find({ owner: userId }).populate("owner");
  };

  const getPageDataOwnedRooms = (
    userId: string,
    take: number | undefined,
    page: number | undefined
  ) => {
    if (!take && !page) {
      return roomModel.find({ owner: userId }).populate("owner");
    }

    return roomModel
      .aggregate()
      .match({ owner: new mongoose.Types.ObjectId(userId) })
      .lookup({
        from: "users",
        let: { owner: "$owner" },
        pipeline: [
          { $match: { $expr: { $eq: ["$_id", "$$owner"] } } },
          { $project: { _id: 1, name: 1, username: 1, email: 1 } },
        ],
        as: "owner",
      })
      .unwind("owner")
      .facet({
        count: [{ $count: "count" }],
        results: [{ $skip: take * page }, { $limit: take }],
      })
      .addFields({ count: { $arrayElemAt: ["$count.count", 0] } });
  };

  const getInvitedRoom = async (userId: string) => {
    const user = await userModel.findById(userId).populate([
      {
        path: "invitedRooms",
        populate: {
          path: "owner",
        },
      },
    ]);
    return user.invitedRooms;
  };

  const getPageDataInvitedRooms = (
    userId: string,
    take: number | undefined,
    page: number | undefined
  ) => {
    if (!take && !page) {
      return roomModel.find({ _id: userId }).populate("invitedRooms");
    }
    return userModel
      .aggregate()
      .match({ _id: new mongoose.Types.ObjectId(userId) })
      .lookup({
        from: "rooms",
        let: { invitedRooms: "$invitedRooms" },
        pipeline: [
          { $match: { $expr: { $in: ["$_id", "$$invitedRooms"] } } },
          {
            $lookup: {
              from: "users",
              let: { owner: "$owner" },
              pipeline: [
                { $match: { $expr: { $eq: ["$_id", "$$owner"] } } },
                { $project: { _id: 1, name: 1, username: 1, email: 1 } },
              ],
              as: "owner",
            },
          },
          {
            $facet: {
              count: [{ $count: "count" }],
              results: [{ $skip: take * page }, { $limit: take }],
            },
          },
          { $addFields: { count: { $arrayElemAt: ["$count.count", 0] } } },
        ],
        as: "invitedRooms",
      })
      .addFields({ roomData: { $first: "$invitedRooms" } })
      .project({
        _id: 0,
        count: "$roomData.count",
        results: "$roomData.results",
      });
  };

  const addMember = async (userId: string, roomId: string) => {
    const room = await roomModel.findOneAndUpdate(
      { _id: roomId },
      { $addToSet: { members: userId as any } }
    );
    await userModel.updateOne(
      { _id: userId },
      {
        $addToSet: {
          invitedRooms: roomId as any,
        },
      }
    );
    return room;
  };

  const addMembers = async (userIds: string[], roomId: string) => {
    await roomModel.findOneAndUpdate(
      { _id: roomId },
      {
        $addToSet: {
          members: {
            $each: userIds as any[],
          },
        },
      }
    );
    await userModel.updateMany(
      { _id: { $in: userIds } },
      {
        $addToSet: {
          invitedRooms: roomId as any,
        },
      }
    );
  };

  const removeMember = async (userId: string, roomId: string) => {
    await roomModel.updateOne({ _id: roomId }, { $pull: { members: userId } });
    await userModel.updateOne(
      { _id: userId },
      { $pull: { invitedRooms: roomId } }
    );
  };

  const removeMembers = async (userIds: string[], roomId: string) => {
    const room = await roomModel.findOneAndUpdate(
      { _id: roomId },
      {
        $pull: {
          members: {
            $each: userIds,
          },
        },
      }
    );
    await userModel.updateMany(
      { _id: { $in: userIds } },
      {
        $pull: {
          invitedRooms: room._id,
        },
      }
    );
  };

  const checkCanAccept = (roomId: string, userId: string) => {
    return roomModel.exists({
      $or: [
        { _id: roomId, members: userId },
        { _id: roomId, owner: userId },
      ],
    });
  };

  return {
    checkCanAccept,
    findById,
    findOneAndAddJoiner,
    findOneAndRemoveJoiner,
    findOneAndUpdatePresent,
    inscreaseFloors,
    deleteFloor,
    create,
    getDetail,
    deleteRoom,
    changeRoomInfo,
    getPageDataOwnedRooms,
    getOwnedRooms,
    getPageDataInvitedRooms,
    getInvitedRoom,
    addMember,
    addMembers,
    removeMember,
    removeMembers,
  };
};
