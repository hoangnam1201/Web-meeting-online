import { Choice, Question } from "../models/question.model";
import { Types } from "mongoose";

export class QuestionCreateDTO {
  quiz: string;
  content: string;
  choices: Choice[];
  type: string;

  static fromQuestion(question: Question) {
    const questionCreate = new QuestionCreateDTO();
    questionCreate.quiz = question.quiz.toString();
    questionCreate.content = question.content;
    questionCreate.type = question.type;
    if (questionCreate.type !== "ESSAY")
      questionCreate.choices = question.choices.map((c) => ({
        ...c,
        _id: new Types.ObjectId(),
      }));
    else {
      questionCreate.choices = [];
    }
    return questionCreate;
  }
}
