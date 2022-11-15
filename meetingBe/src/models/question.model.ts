import { model, ObjectId, Schema, SchemaTypes, Types } from "mongoose";

export class Choice {
  _id: Types.ObjectId;
  content: string;
  isTrue: boolean;
}

export class Question {
  _id: ObjectId;
  quiz: ObjectId;
  content: string;
  choices: Choice[];
  type: "ESSAY" | "ONE" | 'MULTIPLE' | "FILLIN";
}

const QuestionSchema = new Schema<Question>({
  quiz: { type: SchemaTypes.ObjectId, ref: "quiz", required: true },
  content: { type: String, default: "Content of question" },
  type: { type: String, default: "ONE" },
  choices: [
    {
      _id: { type: SchemaTypes.ObjectId, required: true },
      content: { type: String, default: "Content of choice" },
      isTrue: { type: Boolean, default: false },
    },
  ],
});

export default model("question", QuestionSchema);
