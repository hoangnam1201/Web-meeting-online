import { Choice, Question } from "../models/question.model";

export class QuestionUpdateDTO {
  content: string;
  choices: Choice[];
  type: string;

  static fromQuestion(question: Question) {
    const questionUpdate = new QuestionUpdateDTO();
    questionUpdate.content = question.content;
    questionUpdate.choices = question.choices;
    questionUpdate.type = question.type;
    return questionUpdate
  }
}
