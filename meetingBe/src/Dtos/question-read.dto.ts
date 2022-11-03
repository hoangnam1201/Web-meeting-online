import { Choice, Question } from "../models/question.model";

export class QuestionReadDTO {
  _id: string;
  quiz: string;
  content: string;
  choices: Choice[];
  type: string;

  static fromQuestion(question: Question) {
    const questionRead = new QuestionReadDTO();
    questionRead._id = question._id.toString();
    questionRead.quiz = question.quiz.toString();
    questionRead.content = question.content;
    questionRead.choices = question.choices;
    questionRead.type = question.type;
    return questionRead;
  }

  static fromList(questions: Question[]) {
    return questions.map((q) => this.fromQuestion(q));
  }
}
