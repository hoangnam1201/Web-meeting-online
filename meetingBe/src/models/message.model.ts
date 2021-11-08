import { model, ObjectId, Schema, SchemaTypes } from 'mongoose';
import { Room } from './room.model';
import { User } from './user.model';

export class Message {
    _id: any;
    room: ObjectId | Room;
    sender: ObjectId | User;
    message: string;
    like: [{ option: number, user: ObjectId | User }];
    createdAt: Date
}

const messageSchema = new Schema<Message>({
    room: { type: SchemaTypes.ObjectId, ref: 'room' },
    sender: { type: SchemaTypes.ObjectId, ref: 'user' },
    message: String,
    like: [{
        option: Number,
        user: { type: SchemaTypes.ObjectId, ref: 'user' }
    }],
}, { timestamps: {} })

export default model('message', messageSchema);
