import { ObjectId } from "mongoose";
import { Room } from "../models/room.model";
import { User } from "../models/user.model";
import { UserReadDetailDto } from "./user-read-detail.dto";

export class RoomReadDto {
  _id: string;
  name: string;
  description: string;
  startDate: number;
  endDate: number;
  memberCount: number;
  floors: ObjectId[];
  owner: UserReadDetailDto;
  state: string;

  static fromRoom(room: Room) {
    if (!room) return room;
    const roomRead = new RoomReadDto();
    roomRead._id = room._id.toString();
    roomRead.name = room.name;
    roomRead.owner = UserReadDetailDto.fromUser(room.owner as User);
    roomRead.description = room.description;
    roomRead.startDate = room.startDate;
    roomRead.endDate = room.endDate;
    roomRead.memberCount = room.members.length;
    roomRead.floors = room.floors;
    roomRead.state = room.state;
    return roomRead;
  }

  static fromArray(rooms: Room[]) {
    return rooms.map((r) => this.fromRoom(r));
  }
}
