import { NextFunction, Request, Response } from "express";
import { submissionReadDetailDTO } from "../../Dtos/submission-read-detail.dto";
import SubmissionService from "../../services/submission.service";
import QuizService from "../../services/quiz.service";

export class SubmissionMiddleware {
  static submissionService = SubmissionService();
  static quizService = QuizService();

  static async checkTimeCreateSubmission(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    const { quizId } = req.params;
    const { userId } = req.userData;
    const quiz = await SubmissionMiddleware.quizService.getById(quizId);
    const timeNow = new Date().getTime();
    if (!quiz)
      return res
        .status(400)
        .json({ status: 400, msg: "the quiz is not exist" });
    if (quiz.startDate > timeNow) {
      return res.status(400).json({ status: 400, msg: "It's not time to do" });
    }
    if (quiz.endDate < timeNow) {
      return res
        .status(400)
        .json({ status: 400, msg: "this quiz has expired" });
    }

    // check count submission
    const countSubmission =
      await SubmissionMiddleware.submissionService.getCountByQuiz(
        userId,
        quizId
      );
    if (quiz.countSubmission <= countSubmission) {
      return res.status(400).json({
        status: 400,
        msg: `max numbers of submission is ${quiz.countSubmission}`,
      });
    }
    next();
  }

  static async checkSubmitTime(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    const { submissionId } = req.params;
    const submission = await SubmissionMiddleware.submissionService.getById(
      submissionId
    );
    const timeNow = new Date().getTime();
    if (!submission)
      return res
        .status(400)
        .json({ status: 400, msg: "the submission is not exist" });

    const quiz = await SubmissionMiddleware.quizService.getById(
      submission.quiz.toString()
    );
    if (timeNow - submission.startDate >= quiz.duration*60000) {
      const submission =
        await SubmissionMiddleware.submissionService.changeStateSubmit(
          submissionId,
          "SUBMITTED"
        );
      return res.status(200).json({
        status: 200,
        data: submissionReadDetailDTO.fromSubmission(submission),
      });
    }
    next();
  }

  static async checkOwnerSubmssion(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    const { userId } = req.userData;
    const { submissionId } = req.params;
    const submission = await SubmissionMiddleware.submissionService.getById(
      submissionId
    );
    
    if (submission.userId.toString() !== userId) {
      return res.status(400).json({
        status: 400,
        msg: "you don't have permission with this submission",
      });
    }
    next();
  }
}
