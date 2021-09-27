import { Room } from "../models/room.model";
import { User } from "../models/user.model";
import { UserReadDto } from "./UserReadDto";

export class RoomReadDto {
    _id: string;
    name: string;
    description: string;
    startDate: number;
    endDate: number;
    roomType: number;
    memberCount: number;
    owner: UserReadDto;

    static fromRoom(room: Room) {
        const roomRead = new RoomReadDto();
        roomRead._id = room._id.toString();
        roomRead.name = room.name;
        roomRead.owner = UserReadDto.fromUser(room.owner as User);
        roomRead.description = room.description;
        roomRead.startDate = room.startDate;
        roomRead.endDate = room.endDate;
        roomRead.roomType = room.roomType;
        roomRead.memberCount = room.members.length;
        return roomRead;
    }

    static fromArray(rooms: Room[]) {
        let roomReads: RoomReadDto[] = [];
        rooms.forEach(room => {
            roomReads = [...roomReads, RoomReadDto.fromRoom(room)];
        })
        return roomReads;
    }
}
