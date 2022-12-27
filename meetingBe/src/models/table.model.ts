import mongoose, { Schema, model, ObjectId, SchemaTypes } from "mongoose";
import { User } from "./user.model";

export class Table {
  _id: any;
  room: ObjectId;
  name: string;
  users: ObjectId[] | User[];
  members: ObjectId[] | User[];
  numberOfSeat: number;
  floor: ObjectId;
}

const tableSchema = new Schema<Table>({
  room: { type: SchemaTypes.ObjectId, ref: "room" },
  name: String,
  users: [{ type: SchemaTypes.ObjectId, ref: "user" }],
  members: [{ type: SchemaTypes.ObjectId, ref: "user" }],
  floor: { type: SchemaTypes.ObjectId },
  numberOfSeat: Number,
});

export default model("table", tableSchema);
