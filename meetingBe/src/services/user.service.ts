import UserChangeDto from "../Dtos/user-change.dto";
import { UserCreateDto } from "../Dtos/user-create.dto";
import userModel from "../models/user.model";
import cryptoJS from "crypto-js";

export default () => {
  const searchUser = (searchStr: string) => {
    searchStr = searchStr.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    const regex = new RegExp(searchStr, "i");
    return userModel
      .find({
        $or: [{ username: { $regex: regex } }, { email: { $regex: regex } }],
      })
      .sort({ createdAt: 1 })
      .limit(6);
  };

  const findUserById = (id: string) => {
    return userModel.findById(id);
  };

  const findUserByEmail = (email: string) => {
    return userModel.findOne({ email: email });
  };

  const create = (userData: UserCreateDto) => {
    return userModel.create(userData);
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
    verifyEmail,
    searchUser,
    findUserById,
    getUsersByIds,
    create,
    findUserByEmail,
    changeInfo,
    changePassword,
  };
};
