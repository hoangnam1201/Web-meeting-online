import { model, ObjectId, Schema, SchemaTypes, Types } from "mongoose";

export class Queue {
  _id: Types.ObjectId;
  room: Types.ObjectId;
  email: string;
}

const queueSchema = new Schema<Queue>({
  room: { type: SchemaTypes.ObjectId, required: true },
  email: { type: String, required: true },
});

export default model("queue", queueSchema);
