import { model, ObjectId, Schema, SchemaTypes, Types } from "mongoose";
import { Question } from "./question.model";
import { User } from "./user.model";

export class submission {
  _id: Types.ObjectId;
  userId: Types.ObjectId | User;
  quiz: Types.ObjectId;
  startDate: number;
  status: "DOING" | "SUBMITTED";
  answers: {
    questionId: Types.ObjectId | Question;
    answers: {
      answerId: Types.ObjectId;
      content: string;
    }[];
    essay: string;
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
      answers: [
        {
          answerId: { type: SchemaTypes.ObjectId },
          content: { type: String, default: "" },
        },
      ],
      essay: { type: String },
    },
  ],
});

export default model("submission", submissionSchema);
