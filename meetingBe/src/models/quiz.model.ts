import { model, ObjectId, Schema, SchemaTypes } from "mongoose";

export class Quiz {
  _id: ObjectId;
  room: ObjectId;
  name: string;
  description: string;
  startDate: Number;
  duration: Number;
}

const QuizSchema = new Schema<Quiz>({
  room: { type: SchemaTypes.ObjectId, ref: "room" },
  name: String,
  description: String,
  startDate: Number,
  duration: Number,
});

export default model("quiz", QuizSchema);
