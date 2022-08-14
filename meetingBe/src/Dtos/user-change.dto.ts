import { User } from "../models/user.model";

export default class UserChangeDto {
    name: string;
    phone: string;

    static fromUser(user: User){
        const userChange = new UserChangeDto();
        userChange.name = user.name;
        userChange.phone = user.phone;
        return userChange;
    }
}