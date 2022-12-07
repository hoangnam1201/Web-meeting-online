import { model, ObjectId, Schema, SchemaTypes, Types } from "mongoose";

export class Queue {
  _id: Types.ObjectId;
  room: Types.ObjectId;
  email: string;
  createdAt: Date;
}

const queueSchema = new Schema<Queue>({
  room: { type: SchemaTypes.ObjectId, required: true },
  email: { type: String, required: true },
  createdAt: {
    type: SchemaTypes.Date,
    default: Date.now(),
    expires: 10 * 24 * 60 * 60,
  },
});

export default model("queue", queueSchema);
