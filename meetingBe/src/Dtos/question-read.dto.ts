import { Choice, Question } from "../models/question.model";
class ChoiceRead {
  _id: string;
  content: string;
}

export class QuestionReadDTO {
  _id: string;
  quiz: string;
  content: string;
  choices: ChoiceRead[];
  type: string;

  static fromQuestion(question: Question) {
    const questionRead = new QuestionReadDTO();
    questionRead._id = question._id.toString();
    questionRead.quiz = question.quiz.toString();
    questionRead.content = question.content;
    questionRead.choices = question.choices.map((c) => ({
      _id: c._id.toString(),
      content: c.content,
      isTrue: c.isTrue,
    }));
    questionRead.type = question.type;
    return questionRead;
  }

  static fromList(questions: Question[]) {
    return questions.map((q) => this.fromQuestion(q));
  }
}
