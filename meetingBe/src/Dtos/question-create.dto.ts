import { Choice, Question } from "../models/question.model";
import mongoose,{ Types } from "mongoose";

export class QuestionCreateDTO {
  quiz: string;
  content: string;
  choices: Choice[];
  type: string;

  static fromQuestion(question: Question) {
    const questionCreate = new QuestionCreateDTO();
    questionCreate.quiz = question.quiz.toString();
    questionCreate.content = question.content;
    questionCreate.choices = question.choices.map((c) => ({
      ...c,
      _id: new mongoose.Types.ObjectId(),
    }));
    questionCreate.type = question.type;
    return questionCreate;
  }
}
