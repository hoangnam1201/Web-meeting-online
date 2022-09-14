"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MessageReadDto = void 0;
const user_read_dto_1 = require("./user-read.dto");
class MessageReadDto {
    static fromMessage(message) {
        const messageRead = new MessageReadDto();
        messageRead._id = message._id;
        messageRead.sender = user_read_dto_1.UserReadDto.fromUser(message.sender);
        messageRead.message = message.message;
        messageRead.like = message.like;
        messageRead.files = message.files;
        messageRead.createdAt = message.createdAt;
        return messageRead;
    }
    static fromArray(messages) {
        return messages.map((messages) => this.fromMessage(messages));
    }
}
exports.MessageReadDto = MessageReadDto;
//# sourceMappingURL=message-read.dto.js.map