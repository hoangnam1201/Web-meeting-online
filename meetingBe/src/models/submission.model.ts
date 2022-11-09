import { model, ObjectId, Schema, SchemaTypes, Types } from "mongoose";

export class submission {
  _id: Types.ObjectId;
  userId: Types.ObjectId;
  quiz: Types.ObjectId;
  startDate: number;
  status: "DOING" | "SUBMITTED";
  answers: {
    questionId: Types.ObjectId;
    answerIds: Types.ObjectId[];
  }[];
}

const submissionSchema = new Schema<submission>({
  userId: { type: SchemaTypes.ObjectId, ref: "user" },
  quiz: { type: SchemaTypes.ObjectId, ref: "quiz" },
  startDate: { type: Number },
  status: { type: String, default: "DOING" },
  answers: [
    {
      questionId: { type: SchemaTypes.ObjectId, ref: "question" },
      answerIds: [{ type: SchemaTypes.ObjectId }],
    },
  ],
});

export default model("submission", submissionSchema);
