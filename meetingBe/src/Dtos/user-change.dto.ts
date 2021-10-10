import { User } from "../models/user.model";

export default class UserChangeDto {
    name: string;
    dob: Date;
    phone: string;

    static fromUser(user: User){
        const userChange = new UserChangeDto();
        userChange.name = user.name;
        userChange.dob = user.dob;
        userChange.phone = user.phone;
        return userChange;
    }
}