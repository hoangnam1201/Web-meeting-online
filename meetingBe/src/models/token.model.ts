import { model, ObjectId, Schema, SchemaTypes } from "mongoose";

export class Token {
  userId: ObjectId | string;
  token: string;
  createdAt: Date;
}

const schema = new Schema<Token>({
  userId: { type: SchemaTypes.ObjectId, ref: "user" },
  token: { type: String, required: true },
  createdAt: {
    type: SchemaTypes.Date,
    default: Date.now(),
    expires: 10*24*60*60,
  },
});

export default model("token", schema);
