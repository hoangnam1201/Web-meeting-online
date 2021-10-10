import { User } from "../models/user.model";

export class UserReadDto {
    _id: string;
    username: string;
    name: string;
    role: number;
    phone: string;
    dob: Date;
    email: string;
    peerId: string;
    createdAt: Date;

    static fromUser(user: User): UserReadDto {
        const userRead = new UserReadDto();
        userRead._id = user._id.toString();
        userRead.username = user.username;
        userRead.name = user.name;
        userRead.role = user.role;
        userRead.phone = user.phone;
        userRead.dob = user.dob;
        userRead.email = user.email;
        userRead.createdAt = user.createdAt;
        return userRead;
    }
}