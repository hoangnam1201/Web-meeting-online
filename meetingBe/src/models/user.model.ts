import { Schema, model, ObjectId, SchemaTypes } from "mongoose";
import { Room } from "./room.model";

export class User {
  _id: any;
  username: string;
  password: string;
  name: string;
  phone: string;
  email: string;
  invitedRooms: ObjectId[] | Room[];
  createdAt: Date;
  picture: string;
  updatedAt: Date;
  isVerify: boolean;
}

const userSchema = new Schema(
  {
    username: { type: String },
    password: { type: String },
    // socketId: { type: String, default: "" },
    name: { type: String, required: true },
    isLock: { type: Boolean, default: false },
    phone: { type: String },
    email: { type: String, required: true },
    picture: { type: String, required: false },
    invitedRooms: [{ type: SchemaTypes.ObjectId, ref: "room" }],
    isVerify: { type: Boolean, default: false },
  },
  { timestamps: {} }
);

export default model<User>("user", userSchema);
