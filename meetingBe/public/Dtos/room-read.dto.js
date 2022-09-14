"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RoomReadDto = void 0;
const user_read_dto_1 = require("./user-read.dto");
class RoomReadDto {
    static fromRoom(room) {
        const roomRead = new RoomReadDto();
        roomRead._id = room._id.toString();
        roomRead.name = room.name;
        roomRead.owner = user_read_dto_1.UserReadDto.fromUser(room.owner);
        roomRead.description = room.description;
        roomRead.startDate = room.startDate;
        roomRead.endDate = room.endDate;
        roomRead.memberCount = room.members.length;
        roomRead.floors = room.floors;
        return roomRead;
    }
    static fromArray(rooms) {
        let roomReads = [];
        rooms.forEach((room) => {
            roomReads = [...roomReads, RoomReadDto.fromRoom(room)];
        });
        return roomReads;
    }
}
exports.RoomReadDto = RoomReadDto;
//# sourceMappingURL=room-read.dto.js.map