import { Schema, SchemaTypes, model, ObjectId } from 'mongoose';
import { User } from './user.model';

export class Room {
    _id: any;
    name: string;
    description: string;
    roomType: number;
    startDate: number;
    endDate: number;
    owner: ObjectId | User;
    requests: ObjectId[] | User[];
    members: ObjectId[] | User[];
}

const RoomSchema = new Schema<Room>({
    name: String,
    description: String,
    roomType: String,
    startDate: Number,
    endDate: Number,
    owner: { type: SchemaTypes.ObjectId, ref: 'user' },
    requests: [{ type: SchemaTypes.ObjectId, ref: 'user' }],
    members: [{ type: SchemaTypes.ObjectId, ref: 'user' }]
})

export default model('room', RoomSchema);