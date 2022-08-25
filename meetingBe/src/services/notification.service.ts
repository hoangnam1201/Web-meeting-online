import mongoose from "mongoose";
import notificationModel from "../models/notifications.model";

export default () => {
  const Type = { success: 0, receiptInvitation: 1, isRemoved: 2 };

  const createType0N = (userId: string, content: string) => {
    return notificationModel.create({ user: userId, content, isReaded: false });
  };

  const createType12N = (
    userId: string,
    nType: number,
    fromUser: string,
    fromRoom: string
  ) => {
    return notificationModel.create({
      user: userId,
      type: nType,
      content:
        nType === 1
          ? "You are invited to join room"
          : "You were removed from class",
      isReaded: false,
      fromRoom,
      fromUser,
    });
  };

  const read = (nId: string) => {
    return notificationModel.findOneAndUpdate({ _id: nId }, { isRead: true });
  };

  const getByUserId = (userId: number, take: number, page: number) => {
    return notificationModel
      .aggregate()
      .match({ user: new mongoose.Types.ObjectId(userId) })
      .lookup({
        from: "users",
        let: { fromUser: "$fromUser" },
        pipeline: [
          { $match: { $expr: { $eq: ["$_id", "$$fromUser"] } } },
          { $project: { _id: 1, name: 1, username: 1, email: 1 } },
        ],
        as: "owner",
      })
      .lookup({
        from: "rooms",
        let: { fromUser: "$fromRoom" },
        pipeline: [
          { $match: { $expr: { $eq: ["$_id", "$$fromRoom"] } } },
          { $project: { _id: 1, name: 1 } },
        ],
        as: "owner",
      })
      .facet({
        count: [{ $count: "count" }],
        results: [{ $skip: take * page, $limit: take }],
      })
      .addFields({ count: { $arrayElemAt: ["$count.count", [0]] } });
  };

  return {
    createType0N,
    createType12N,
    Type,
    read,
    getByUserId,
  };
};
