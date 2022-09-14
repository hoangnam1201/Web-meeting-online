"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RoomCreateDto = void 0;
class RoomCreateDto {
    static fromRoom(room) {
        const roomCreate = new RoomCreateDto();
        roomCreate.name = room.name;
        roomCreate.owner = room.owner;
        roomCreate.description = room.description;
        roomCreate.startDate = room.startDate;
        roomCreate.endDate = room.endDate;
        return roomCreate;
    }
}
exports.RoomCreateDto = RoomCreateDto;
//# sourceMappingURL=room-create.dto.js.map