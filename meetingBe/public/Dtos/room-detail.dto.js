"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RoomReadDetailDto = void 0;
const user_read_dto_1 = require("./user-read.dto");
class RoomReadDetailDto {
    static fromRoom(room) {
        const roomRead = new RoomReadDetailDto();
        roomRead._id = room._id.toString();
        roomRead.name = room.name;
        roomRead.owner = user_read_dto_1.UserReadDto.fromUser(room.owner);
        roomRead.description = room.description;
        roomRead.startDate = room.startDate;
        roomRead.endDate = room.endDate;
        roomRead.isPresent = room.isPresent;
        roomRead.floors = room.floors;
        roomRead.members = [];
        room.members.forEach((user) => {
            roomRead.members = [
                ...roomRead.members,
                user_read_dto_1.UserReadDto.fromUser(user),
            ];
        });
        return roomRead;
    }
    static fromArray(rooms) {
        let roomReads = [];
        rooms.forEach((room) => {
            roomReads = [...roomReads, RoomReadDetailDto.fromRoom(room)];
        });
        return roomReads;
    }
}
exports.RoomReadDetailDto = RoomReadDetailDto;
//# sourceMappingURL=room-detail.dto.js.map