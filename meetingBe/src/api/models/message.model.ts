import { model, ObjectId, Schema, SchemaTypes } from 'mongoose';

export class Message {
    room: ObjectId;
    sender: ObjectId;
    message: string;
    like: { option: number, user: ObjectId };
    createDate: Date
}

const messageSchema = new Schema<Message>({
    room: { type: SchemaTypes.ObjectId, ref: 'room' },
    sender: { type: SchemaTypes.ObjectId, ref: 'user' },
    message: String,
    like: [{
        option: Number,
        user: { type: SchemaTypes.ObjectId, ref: 'user' }
    }],
    createDate: { type: SchemaTypes.Date, default: new Date(Date.now()) }
})

export default model('message', messageSchema);
