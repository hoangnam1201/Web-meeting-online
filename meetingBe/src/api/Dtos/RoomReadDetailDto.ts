
import { Room } from "../models/room.model";
import { User } from "../models/user.model";
import { UserReadDto } from "./UserReadDto";

export class RoomReadDetailDto {
    _id: string;
    name: string;
    description: string;
    startDate: number;
    endDate: number;
    roomType: number;
    owner: UserReadDto;
    users: UserReadDto[];
    requests: UserReadDto[];

    static fromRoom(room: Room) {
        const roomRead = new RoomReadDetailDto();
        roomRead._id = room._id.toString();
        roomRead.name = room.name;
        roomRead.owner = UserReadDto.fromUser(room.owner as User);
        roomRead.description = room.description;
        roomRead.roomType = room.roomType;
        roomRead.startDate = room.startDate;
        roomRead.endDate = room.endDate;
        roomRead.users = [];
        room.members.forEach(user => {
            roomRead.users = [...roomRead.users, UserReadDto.fromUser(user as User)];
        })
        roomRead.requests = [];
        room.requests.forEach(user => {
            roomRead.requests = [...roomRead.requests, UserReadDto.fromUser(user as User)];
        })
        return roomRead;
    }

    static fromArray(rooms: Room[]) {
        let roomReads: RoomReadDetailDto[] = [];
        rooms.forEach(room => {
            roomReads = [...roomReads, RoomReadDetailDto.fromRoom(room)];
        })
        return roomReads;
    }
}
