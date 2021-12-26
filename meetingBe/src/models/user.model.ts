import { Schema, model, ObjectId, SchemaTypes } from 'mongoose';
import { Room } from './room.model';

export class User {
    _id: any;
    username: string;
    password: string;
    name: string;
    role: number;
    phone: string;
    dob: Date;
    email: string;
    invitedRooms: ObjectId[] | Room[];
    createdAt: Date;
    updatedAt: Date;
}

const userSchema = new Schema({
    username: { type: String, required: true },
    password: { type: String, required: true },
    socketId: { type: String, default: '' },
    name: { type: String, required: true },
    isOnline: { type: Boolean, default: false },
    isLook: { type: Boolean, default: false },
    role: { type: Number, required: true },
    phone: { type: String, required: true },
    dob: { type: Date, required: true },
    email: { type: String, required: true },
    invitedRooms: [{ type: SchemaTypes.ObjectId, ref: 'room' }]
}, { timestamps: {} })

export default model<User>('user', userSchema);