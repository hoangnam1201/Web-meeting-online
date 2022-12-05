import { User } from "../models/user.model";

export class UserReadPermissionDto {
  id: string;
  name: string;
  email: string;
  role: string;
  maxNoE: number;
  picture: string

  static fromUser(user: User): UserReadPermissionDto {
    const userRead = new UserReadPermissionDto();
    userRead.id = user._id.toString();
    userRead.name = user.name;
    userRead.email = user.email;
    userRead.maxNoE = user.maxNoE;
    userRead.role = user.role;
    userRead.picture = user.picture;
    return userRead;
  }

  static fromArrayUser(users: User[]): UserReadPermissionDto[] {
    return users.map((u) => this.fromUser(u));
  }
}
