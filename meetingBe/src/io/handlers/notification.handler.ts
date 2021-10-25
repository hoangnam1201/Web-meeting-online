import { Socket } from "socket.io";
import notificationModel from "../../models/notifications.model";

export default (io: any) => {
    const getNotification = async (socket: Socket) => {
        const userId = socket.data.userData.userId;
        try {
            const notification = await notificationModel.find({ user: userId })
                .sort({ createdAt: 1 }).skip(0).limit(10);
            socket.emit('notifications', notification);
        } catch (err) {
            socket.emit('err', err);
        }
    }
    return {
        getNotification
    }
}