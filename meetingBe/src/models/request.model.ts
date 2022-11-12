import { model, Schema, SchemaTypes, Types } from "mongoose";

export class Request {
  user: Types.ObjectId;
  socketId: string;
  roomId: string;
}

const requestSchema = new Schema({
  user: { type: SchemaTypes.ObjectId, ref: "user" },
  socketId: { type: String, require: true },
  roomId: { type: SchemaTypes.ObjectId, ref: "room" },
});

export default model("request", requestSchema);