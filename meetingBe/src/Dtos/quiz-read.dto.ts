import { Quiz } from "../models/quiz.model";

export class QuizReadDTO {
  _id: string;
  room: string;
  name: string;
  description: string;
  startDate: number;
  endDate: number;
  duration: number;
  countSubmission: number;

  static fromQuiz(quiz: Quiz) {
    if (!quiz) return null;
    const quizRead = new QuizReadDTO();
    quizRead._id = quiz._id.toString();
    quizRead.room = quiz.room.toString();
    quizRead.name = quiz.name;
    quizRead.description = quiz.description;
    quizRead.startDate = quiz.startDate;
    quizRead.endDate = quiz.endDate;
    quizRead.duration = quiz.duration;
    quizRead.countSubmission = quiz.countSubmission;
    return quizRead;
  }

  static fromList(quizs: Quiz[]) {
    return quizs.map((q) => this.fromQuiz(q));
  }
}
