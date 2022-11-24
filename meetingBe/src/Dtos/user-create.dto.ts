import { User } from "../models/user.model";
import cryptoJS from "crypto-js";

export class UserCreateDto {
  username: string;
  name: string;
  password: string;
  phone: string;
  email: string;
  picture: string;

  static fromUser(user: User): UserCreateDto {
    const userCreate = new UserCreateDto();
    userCreate.username = user.username;
    userCreate.name = user.name;
    userCreate.password = cryptoJS.SHA256(user.password).toString();
    userCreate.phone = user.phone;
    userCreate.email = user.email;
    userCreate.picture = user.picture;
    return userCreate;
  }

  static fromGmailUser(user: {
    email: string;
    picture: string;
    name: string;
  }): UserCreateDto {
    const userCreate = new UserCreateDto();
    userCreate.name = user.name;
    userCreate.email = user.email;
    userCreate.picture = user.picture;
    return userCreate;
  }
}
