import { model, ObjectId, Schema, SchemaTypes } from "mongoose";
import { User } from "./user.model";
import { Room } from "./room.model";

export class Notification {
  _id: any;
  // 0 success
  // 1 receipt invitation
  // 2 is removed from meeting
  type: number; 
  content: string;
  fromUser: ObjectId | User;
  fromRoom: ObjectId | Room;
  createdAt: Date;
  user: ObjectId | User;
  isReaded: boolean;
}

const notificationSchema = new Schema<Notification>(
  {
    type: Number,
    content: String,
    fromUser: { type: SchemaTypes.ObjectId, ref: "user" },
    fromRoom: { type: SchemaTypes.ObjectId, ref: "room" },
    user: { type: SchemaTypes.ObjectId, ref: "user" },
    isReaded: Boolean,
  },
  { timestamps: {} }
);

const notificationModel = model("notification", notificationSchema);
export default notificationModel;
