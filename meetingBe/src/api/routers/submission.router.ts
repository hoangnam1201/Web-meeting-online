import { Router } from "express";
import SubmissionController from "../controllers/submission.controller";
import AuthMiddlesware from "../middlewares/auth.middleware";

const submissionRouter = Router();
const submissionController = SubmissionController();

submissionRouter.post(
  "/:quizId",
  AuthMiddlesware.verifyToken,
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
  AuthMiddlesware.verifyToken,
  submissionController.submitAnswers
);

export default submissionRouter;
