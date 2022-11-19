import { Choice, Question } from "../models/question.model";
class ChoiceRead {
  _id: string;
  content: string;
}

export class QuestionBriefReadDTO {
  _id: string;
  quiz: string;
  content: string;
  choices: ChoiceRead[];
  type: string;

  static fromQuestion(question: Question) {
    const questionRead = new QuestionBriefReadDTO();
    questionRead._id = question._id.toString();
    questionRead.quiz = question.quiz.toString();
    questionRead.content = question.content;
    questionRead.type = question.type;
    return questionRead;
  }

  static fromList(questions: Question[]) {
    return questions.map((q) => this.fromQuestion(q));
  }
}
