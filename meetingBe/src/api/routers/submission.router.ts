import { Router } from "express";
import SubmissionController from "../controllers/submission.controller";
import AuthMiddlesware from "../middlewares/auth.middleware";
import { SubmissionMiddleware } from "../middlewares/submission.middeware";

const submissionRouter = Router();
const submissionController = SubmissionController();

submissionRouter.post(
  "/:quizId",
  [AuthMiddlesware.verifyToken, SubmissionMiddleware.checkTimeCreateSubmission],
  submissionController.createSubmission
);

submissionRouter.get(
  "/:submissionId",
  AuthMiddlesware.verifyToken,
  submissionController.getSubmissionById
);

submissionRouter.get(
  "/scores/:quizId",
  AuthMiddlesware.verifyToken,
  submissionController.getScoresInQuiz
);

submissionRouter.get(
  "/my-scores/:quizId",
  AuthMiddlesware.verifyToken,
  submissionController.getScoresByQuiz
);

submissionRouter.get(
  "/download/:submissionId",
  AuthMiddlesware.verifyToken,
  submissionController.downloadSubmission
);

submissionRouter.get(
  "/download-in-quiz/:quizId",
  AuthMiddlesware.verifyToken,
  submissionController.downloadSubmissionInQuiz
);

submissionRouter.get(
  "/submissions-in-quiz/:quizId",
  AuthMiddlesware.verifyToken,
  submissionController.getSubmissionInQuiz
);

submissionRouter.get(
  "/submission-by-quiz/:quizId",
  AuthMiddlesware.verifyToken,
  submissionController.getSubmissionByQuiz
);

submissionRouter.post(
  "/submit-answers/:submissionId",
  [
    AuthMiddlesware.verifyToken,
    SubmissionMiddleware.checkOwnerSubmssion,
    SubmissionMiddleware.checkSubmitTime,
  ],
  submissionController.submitAnswers
);

submissionRouter.put(
  "/submit/:submissionId",
  [AuthMiddlesware.verifyToken, SubmissionMiddleware.checkOwnerSubmssion],
  submissionController.submitSubmission
);

export default submissionRouter;
