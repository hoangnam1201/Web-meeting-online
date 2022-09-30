import { User } from "../models/user.model";

export class UserReadDetailDto {
  _id: string;
  username: string;
  name: string;
  phone: string;
  email: string;
  picture: string;
  isVerify: boolean;
  createdAt: Date;

  static fromUser(user: User): UserReadDetailDto {
    const userRead = new UserReadDetailDto();
    userRead._id = user._id.toString();
    userRead.username = user.username;
    userRead.name = user.name;
    userRead.phone = user.phone;
    userRead.email = user.email;
    userRead.picture = user.picture;
    userRead.isVerify = user.isVerify;
    userRead.createdAt = user.createdAt;
    return userRead;
  }

  static fromArrayUser(users: User[]): UserReadDetailDto[] {
    let usersReads: UserReadDetailDto[] = [];
    users.forEach((user) => {
      usersReads = [...usersReads, this.fromUser(user)];
    });
    return usersReads;
  }
}
