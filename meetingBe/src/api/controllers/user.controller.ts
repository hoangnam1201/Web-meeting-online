import { validationResult } from "express-validator";
import { Request, Response } from "express";
import { UserReadDetailDto } from "../../Dtos/user-read-detail.dto";
import { UserCreateDto } from "../../Dtos/user-create.dto";
import UserChangeDto from "../../Dtos/user-change.dto";
import UserService from "../../services/user.service";
import { UserReadPermissionDto } from "../../Dtos/user-read-permission.dto";

export default () => {
  const userService = UserService();
  const searchUser = async (req: Request, res: Response) => {
    let searchValue = req.query.searchValue || "";
    try {
      const users = await userService.searchUser(searchValue as string);
      return res.status(200).json({ status: 200, data: users });
    } catch {
      return res
        .status(500)
        .json({ status: 500, data: null, msg: "internal server errror" });
    }
  };

  const updatePermission = async (req: Request, res: Response) => {
    const { ids, permission } = req.body;
    try {
      const users = await userService.updatePermission(ids, permission);
      return res.status(200).json({ status: 200, data: users });
    } catch {
      return res
        .status(500)
        .json({ status: 500, data: null, msg: "internal server errror" });
    }
  };

  const getUsers = async (req: Request, res: Response) => {
    const { take = 10, page = 0, role, searchStr = "" } = req.query;
    try {
      const users = await userService.getUsers(
        searchStr.toString(),
        role ? role.toString() : undefined,
        parseInt(take.toString()),
        parseInt(page.toString())
      );
      return res.status(200).json({
        status: 200,
        data: {
          count: users[0].count,
          records: UserReadPermissionDto.fromArrayUser(users[0].records),
        },
      });
    } catch (e) {
      console.log(e);
      return res
        .status(500)
        .json({ status: 500, data: null, msg: "internal server errror" });
    }
  };

  const findUserById = async (req: Request, res: Response) => {
    const userId = req.query.userId;
    try {
      const user = await userService.findUserById(userId as string);
      return res
        .status(200)
        .json({ status: 200, data: UserReadDetailDto.fromUser(user) });
    } catch {
      return res
        .status(500)
        .json({ status: 500, data: null, msg: "Internal Server Errror" });
    }
  };

  const register = async (req: Request, res: Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ status: 400, errors: errors.array() });
    }
    const userCreate = UserCreateDto.fromUser(req.body);
    try {
      await userService.create(userCreate);
      return res.status(200).json({ status: 200, data: null });
    } catch (err) {
      console.log(err);
      return res
        .status(500)
        .json({ status: 500, data: null, msg: "Internal Server Errror" });
    }
  };

  const getById = async (req: Request, res: Response) => {
    const { userId } = req.params;
    try {
      const user = await userService.findUserById(userId);
      const userRead = UserReadDetailDto.fromUser(user);
      return res.status(200).json({ status: 200, data: userRead });
    } catch (err) {
      return res
        .status(500)
        .json({ status: 500, data: null, msg: "Internal Server Errror" });
    }
  };

  const getDetail = async (req: Request, res: Response) => {
    const userId = req.userData.userId;
    try {
      const user = await userService.findUserById(userId);
      const userRead = UserReadDetailDto.fromUser(user);
      return res.status(200).json({ status: 200, data: userRead });
    } catch (err) {
      return res
        .status(500)
        .json({ status: 500, data: null, msg: "Internal Server Errror" });
    }
  };

  const changeInfor = async (req: Request, res: Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ status: 400, errors: errors.array() });
    }
    const userId = req.userData.userId;
    const userChange = UserChangeDto.fromUser(req.body);
    try {
      const user = await userService.changeInfo(userId, userChange);
      return res.status(200).json({ status: 200, data: user });
    } catch (err) {
      return res
        .status(500)
        .json({ status: 500, data: null, msg: "Internal Server Errror" });
    }
  };

  const changePassword = async (req: Request, res: Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ status: 400, errors: errors.array() });
    }

    const userId = req.userData.userId;
    const password = req.body.password;
    try {
      const user = await userService.changePassword(userId, password);
      return res.status(200).json({ status: 200, data: user });
    } catch (err) {
      return res
        .status(500)
        .json({ status: 500, data: null, msg: "Internal Server Errror" });
    }
  };

  return {
    searchUser,
    findUserById,
    register,
    getDetail,
    getById,
    changeInfor,
    changePassword,
    updatePermission,
    getUsers,
  };
};
