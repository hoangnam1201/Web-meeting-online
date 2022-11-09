import { User } from "../models/user.model";

export class UserReadDto {
  id: string;
  name: string;
  phone: string;
  email: string;

  static fromUser(user: User): UserReadDto | null {
    if (!user) return null;
    const userRead = new UserReadDto();
    userRead.id = user._id.toString();
    userRead.name = user.name;
    userRead.phone = user.phone;
    userRead.email = user.email;
    return userRead;
  }

  static fromArrayUser(users: User[]): UserReadDto[] {
    let usersReads: UserReadDto[] = [];
    users.forEach((user) => {
      usersReads = [...usersReads, this.fromUser(user)];
    });
    return usersReads;
  }
}
