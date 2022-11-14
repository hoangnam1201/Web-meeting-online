import { Quiz } from "../models/quiz.model";

export class QuizUpdateDTO {
  name: string;
  description: string;
  startDate: number;
  duration: number;
  endDate: number;
  countSubmission: number;
  static fromQuiz(quiz: Quiz) {
    const quizUpdate = new QuizUpdateDTO();
    quizUpdate.name = quiz.name;
    quizUpdate.description = quiz.description;
    quizUpdate.startDate = quiz.startDate;
    quizUpdate.endDate = quiz.endDate;
    quizUpdate.duration = quiz.duration;
    quizUpdate.countSubmission = quiz.countSubmission;
    return quizUpdate;
  }
}
