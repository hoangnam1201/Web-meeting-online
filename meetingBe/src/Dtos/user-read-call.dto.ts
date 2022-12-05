import { User } from "../models/user.model";

export class UserReadCallDto {
  _id: string;
  username: string;
  name: string;
  peerId: string;

  static fromUser(user: User): UserReadCallDto {
    const userRead = new UserReadCallDto();
    userRead._id = user._id.toString();
    userRead.username = user.username;
    userRead.name = user.name;
    return userRead;
  }

  static fromArrayUser(users: User[]): UserReadCallDto[] {
    return users.map((user) => this.fromUser(user));
  }
}
