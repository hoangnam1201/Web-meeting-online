import { UserReadCallDto } from "./user-read-call.dto";

export class UserTableReadDto {
    user: UserReadCallDto;
    video: boolean;
    audio: boolean;
    peerId: string;

    static fromUserTable(userTable: any): UserTableReadDto {
        const userRead = new UserTableReadDto();
        userRead.user = UserReadCallDto.fromUser(userTable.user);
        userRead.video = userTable.video;
        userRead.audio = userTable.audio;
        userRead.peerId = userTable.peerId;
        return userRead;
    }

    static fromArray(userTables: any): UserTableReadDto[] {
        return userTables.map((userTable: any) => this.fromUserTable(userTable));
    }
}