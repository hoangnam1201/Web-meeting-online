import mongoose, { Schema, model, ObjectId, SchemaTypes } from 'mongoose';

export class Table {
    room: ObjectId;
    name: string;
    users: [ObjectId]
    numberOfSeat: number
}

const tableSchema = new Schema<Table>({
    room: { type: SchemaTypes.ObjectId, ref: 'room' },
    name: String,
    users: [{ type: SchemaTypes.ObjectId, ref: 'user' }],
    numberOfSeat: Number
})

export default model('table', tableSchema);