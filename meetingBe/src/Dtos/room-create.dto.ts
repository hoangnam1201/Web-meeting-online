import { ObjectId } from "mongoose";
import { Room } from "../models/room.model";

export class RoomCreateDto {
  name: string;
  description: string;
  startDate: number;
  endDate: number;
  owner: ObjectId;

  static fromRoom(room: Room) {
    const roomCreate = new RoomCreateDto();
    roomCreate.name = room.name;
    roomCreate.owner = room.owner as ObjectId;
    roomCreate.description = room.description;
    roomCreate.startDate = room.startDate;
    roomCreate.endDate = room.endDate;
    return roomCreate;
  }
}
