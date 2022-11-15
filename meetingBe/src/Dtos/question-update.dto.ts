import { Types } from "mongoose";
import { Choice, Question } from "../models/question.model";

export class QuestionUpdateDTO {
  content: string;
  choices: Choice[];
  type: string;

  static fromQuestion(question: Question) {
    const questionUpdate = new QuestionUpdateDTO();
    questionUpdate.content = question.content;
    questionUpdate.choices = question.choices.map((c) => ({
      _id: c._id ? c._id : new Types.ObjectId(),
      content: c.content,
      isTrue: c.isTrue,
    }));
    questionUpdate.type = question.type;
    return questionUpdate;
  }
}
