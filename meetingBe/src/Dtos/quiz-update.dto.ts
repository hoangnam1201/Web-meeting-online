import { Quiz } from "../models/quiz.model";

export class QuizUpdateDTO {
  name: string;
  description: string;
  startDate: Number;
  duration: Number;
  static fromQuiz(quiz: Quiz) {
    const quizUpdate = new QuizUpdateDTO();
    quizUpdate.name = quiz.name;
    quizUpdate.description = quiz.description;
    quizUpdate.startDate = quiz.startDate;
    quizUpdate.duration = quiz.duration;
    return quizUpdate;
  }
}
