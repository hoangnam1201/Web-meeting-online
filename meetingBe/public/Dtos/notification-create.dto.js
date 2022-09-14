"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NotificationCreateDto = void 0;
class NotificationCreateDto {
    static fromRoomNotification(msg, fromRoomId, userId) {
        const notification = new NotificationCreateDto();
        notification.type = 1;
        notification.content = msg;
        notification.fromRoom = fromRoomId;
        notification.user = userId;
        notification.read = false;
        return notification;
    }
    static fromUserNotification(msg, fromUserId, userId) {
        const notification = new NotificationCreateDto();
        notification.type = 0;
        notification.content = msg;
        notification.fromUser = fromUserId;
        notification.user = userId;
        notification.read = false;
        return notification;
    }
}
exports.NotificationCreateDto = NotificationCreateDto;
//# sourceMappingURL=notification-create.dto.js.map