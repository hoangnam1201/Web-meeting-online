import { model, ObjectId, Schema, SchemaTypes } from "mongoose";

export class Quiz {
  _id: ObjectId;
  room: ObjectId;
  name: string;
  description: string;
  startDate: number;
  endDate: number;
  duration: number;
  countSubmission: number;
}

const QuizSchema = new Schema<Quiz>({
  room: { type: SchemaTypes.ObjectId, ref: "room" },
  name: { type: String, required: true },
  description: { type: String, required: true },
  startDate: { type: Number, required: true },
  endDate: { type: Number, required: true },
  duration: { type: Number, default: 5 },
  countSubmission: { type: Number, default: 1 },
});

export default model("quiz", QuizSchema);
