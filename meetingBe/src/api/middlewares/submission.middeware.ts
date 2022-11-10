import { NextFunction, Request, Response } from "express";
import QuizService from "../../services/quiz.service";
import SubmissionService from "../../services/submission.service";

export class SubmissionMiddleware {
  static submissionService = SubmissionService();
  static quizService = QuizService();

  static async checkTimeCreateSubmission(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    const { quizId } = req.params;
    const quiz = await this.quizService.getById(quizId);
    const timeNow = new Date().getTime();
    if (!quiz)
      return res
        .status(400)
        .json({ status: 400, msg: "the quiz is not exist" });
    if (quiz.startDate > timeNow) {
      return res
        .status(400)
        .json({ status: 400, msg: "the quiz is not exist" });
    }
    next();
  }

  static async checkSubmitTime(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    const { submissionId } = req.params;
    const submission = await this.submissionService.getById(submissionId);
    const timeNow = new Date().getTime();
    if (!submission)
      return res
        .status(400)
        .json({ status: 400, msg: "the submission is not exist" });

    const quiz = await this.quizService.getById(submission.quiz.toString());
    if (timeNow - submission.startDate >= quiz.duration)
      return res
        .status(400)
        .json({ status: 400, msg: "quiz timed out" });

    next();
  }

}
