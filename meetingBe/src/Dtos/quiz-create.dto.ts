import { Quiz } from "../models/quiz.model";

export class QuizCreateDTO {
  room: string;
  name: string;
  description: string;
  startDate: number;
  endDate: number;
  duration: number;

  static fromQuiz(quiz: Quiz) {
    const quizCreate = new QuizCreateDTO();
    quizCreate.room = quiz.room.toString();
    quizCreate.name = quiz.name;
    quizCreate.description = quiz.description;
    quizCreate.startDate = quiz.startDate;
    quizCreate.endDate = quiz.endDate;
    quizCreate.duration = quiz.duration;
    return quizCreate;
  }
}
