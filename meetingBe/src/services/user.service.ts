import UserChangeDto from "../Dtos/user-change.dto";
import { UserCreateDto } from "../Dtos/user-create.dto";
import userModel from "../models/user.model";
import cryptoJS from "crypto-js";
import QueueService from "./queue.service";

export default () => {
  const queueService = QueueService();

  const searchUser = (searchStr: string) => {
    searchStr = searchStr.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    const regex = new RegExp(searchStr, "i");
    return userModel
      .find({
        $or: [{ name: { $regex: regex } }, { email: { $regex: regex } }],
      })
      .sort({ createdAt: 1 })
      .limit(6);
  };

  const updatePermission = (
    ids: string[],
    permission: { role: string; maxNoE: number }
  ) => {
    if (permission.role === "USER") permission.maxNoE = 0;
    return userModel.updateMany({ _id: { $in: ids } }, permission);
  };

  const getUsers = (
    searchStr: string,
    role: string | undefined,
    take: number,
    page: number
  ) => {
    searchStr = searchStr.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    const regex = new RegExp(searchStr, "i");
    let $and: any[] = [
      {
        $or: [{ name: { $regex: regex } }, { email: { $regex: regex } }],
      },
    ];
    if (role) $and = [...$and, { role: role }];
    return userModel
      .aggregate()
      .match({ $and })
      .facet({
        count: [{ $count: "count" }],
        records: [{ $skip: take * page }, { $limit: take }],
      })
      .addFields({ count: { $arrayElemAt: ["$count.count", 0] } });
  };

  const findUserById = (id: string) => {
    return userModel.findById(id);
  };

  const findUserByEmail = (email: string) => {
    return userModel.findOne({ email: email });
  };

  const findUserByEmails = (emails: string[]) => {
    return userModel.find({ email: { $in: emails } });
  };

  const create = async (userData: UserCreateDto) => {
    const user = await userModel.create(userData);
    await queueService.executeQueue(user.email, user._id);
    return user;
  };

  const changeInfo = (id: string, userData: UserChangeDto) => {
    return userModel.findByIdAndUpdate(id, { ...userData }, { new: true });
  };

  const changePassword = (id: string, password: string) => {
    return userModel.findByIdAndUpdate(id, {
      password: cryptoJS.SHA256(password).toString(),
    });
  };

  const getUsersByIds = (ids: string[]) => {
    return userModel.find({ _id: { $in: ids } });
  };

  const verifyEmail = (userId: string) => {
    return userModel.findOneAndUpdate({ _id: userId }, { isVerify: true });
  };

  return {
    getUsers,
    verifyEmail,
    searchUser,
    findUserById,
    getUsersByIds,
    create,
    findUserByEmail,
    findUserByEmails,
    updatePermission,
    changeInfo,
    changePassword,
  };
};
