import { ObjectId } from "mongoose";

export class NotificationCreateDto {
    type: number;
    content: string;
    fromUser: ObjectId | string;
    fromRoom: ObjectId | string;
    user: ObjectId | string;
    read: boolean;

    static fromRoomNotification(msg: string, fromRoomId: ObjectId | string, userId: ObjectId | string) {
        const notification = new NotificationCreateDto();
        notification.type = 1;
        notification.content = msg;
        notification.fromRoom = fromRoomId;
        notification.user = userId;
        notification.read = false;
        return notification;
    }

    static fromUserNotification(msg: string, fromUserId: ObjectId | string, userId: ObjectId | string) {
        const notification = new NotificationCreateDto();
        notification.type = 0;
        notification.content = msg;
        notification.fromUser = fromUserId;
        notification.user = userId;
        notification.read = false;
        return notification;
    }
}