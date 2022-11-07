import { ObjectId } from "mongoose";
import { Room } from "../models/room.model";
import { User } from "../models/user.model";
import { UserReadDetailDto } from "./user-read-detail.dto";

export class RoomReadDetailDto {
  _id: string;
  name: string;
  description: string;
  startDate: number;
  endDate: number;
  isPresent: boolean;
  floors: ObjectId[];
  state: string;
  owner: UserReadDetailDto;
  members: UserReadDetailDto[];

  static fromRoom(room: Room) {
    const roomRead = new RoomReadDetailDto();
    roomRead._id = room._id.toString();
    roomRead.name = room.name;
    roomRead.owner = UserReadDetailDto.fromUser(room.owner as User);
    roomRead.description = room.description;
    roomRead.startDate = room.startDate;
    roomRead.endDate = room.endDate;
    roomRead.isPresent = room.isPresent;
    roomRead.floors = room.floors;
    roomRead.members = [];
    roomRead.state = room.state;
    room.members.forEach((user) => {
      roomRead.members = [
        ...roomRead.members,
        UserReadDetailDto.fromUser(user as User),
      ];
    });
    return roomRead;
  }

  static fromArray(rooms: Room[]) {
    let roomReads: RoomReadDetailDto[] = [];
    rooms.forEach((room) => {
      roomReads = [...roomReads, RoomReadDetailDto.fromRoom(room)];
    });
    return roomReads;
  }
}
