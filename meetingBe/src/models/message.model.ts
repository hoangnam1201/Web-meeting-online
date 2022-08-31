import { model, ObjectId, Schema, SchemaTypes } from "mongoose";
import { Room } from "./room.model";
import { User } from "./user.model";

export class Message {
  _id: any;
  room: ObjectId | Room;
  sender: ObjectId | User;
  message: string;
  files: [{ fileId: string; name: string }];
  like: [{ option: number; user: ObjectId | User }];
  createdAt: Date;
}

const messageSchema = new Schema<Message>(
  {
    room: { type: SchemaTypes.ObjectId, ref: "room" },
    sender: { type: SchemaTypes.ObjectId, ref: "user" },
    message: String,
    files: [{ fileId: String, name: String }],
    like: [
      {
        option: Number,
        user: { type: SchemaTypes.ObjectId, ref: "user" },
      },
    ],
  },
  { timestamps: {} }
);

export default model("message", messageSchema);
