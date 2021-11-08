import mongoose, { Schema, model, ObjectId, SchemaTypes } from 'mongoose';
import { User } from './user.model';

export class Table {
    _id: any;
    room: ObjectId;
    name: string;
    users: [ObjectId] | User[];
    numberOfSeat: number
}

const tableSchema = new Schema<Table>({
    room: { type: SchemaTypes.ObjectId, ref: 'room' },
    name: String,
    users: [{
        user: { type: SchemaTypes.ObjectId, ref: 'user' },
        video: Boolean,
        audio: Boolean,
        peerId: String,
    }],
    numberOfSeat: Number
})

export default model('table', tableSchema);