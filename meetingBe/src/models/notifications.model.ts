import { model, ObjectId, Schema, SchemaTypes } from "mongoose";
import { User } from "./user.model";
import { Room } from './room.model'

export class Notification {
    _id: any;
    type: number;
    content: string;
    fromUser: ObjectId | User;
    fromRoom: ObjectId | Room;
    createdAt: Date;
    user: ObjectId | User;
    read: boolean;
}

const notificationSchema = new Schema<Notification>({
    type: Number,
    content: String,
    fromUser: { type: SchemaTypes.ObjectId, ref: 'user' },
    fromRoom: { type: SchemaTypes.ObjectId, ref: 'room' },
    user: { type: SchemaTypes.ObjectId, ref: 'user' },
    read: Boolean
}, { timestamps: {} })

const notificationModel = model('notification', notificationSchema);
export default notificationModel;
