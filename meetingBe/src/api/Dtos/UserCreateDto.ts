import { User } from "../models/user.model";
import cryptoJS from 'crypto-js';

export class UserCreateDto {
    username: string;
    name: string;
    password: string;
    role: number;
    phone: string;
    dob: Date;
    email: string

    static fromUser(user: User): UserCreateDto {
        const userCreate = new UserCreateDto();
        userCreate.username = user.username;
        userCreate.name = user.name;
        userCreate.password = cryptoJS.SHA256(user.password).toString() ;
        userCreate.role = 1;
        userCreate.phone = user.phone;
        userCreate.dob = user.dob;
        userCreate.email = user.email;
        return userCreate;
    }
}