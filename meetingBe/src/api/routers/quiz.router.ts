import { Router } from "express";
import QuizController from "../controllers/quiz.controller";
import AuthMiddlesware from "../middlewares/auth.middleware";
import { QuizValidator } from "../validations/quiz.validator";

const quizRouter = Router();
const quizController = QuizController();

quizRouter.post(
  "",
  [AuthMiddlesware.verifyToken, ...QuizValidator.checkCreate()],
  quizController.createQuiz
);
quizRouter.put(
  "/:quizId",
  [AuthMiddlesware.verifyToken, ...QuizValidator.checkUpdate()],
  quizController.updateQuiz
);
quizRouter.delete(
  "/:quizId",
  [AuthMiddlesware.verifyToken],
  quizController.deleteQuiz
);
quizRouter.get(
  "/:quizId",
  [AuthMiddlesware.verifyToken],
  quizController.getQuizById
);
quizRouter.get(
  "/get-all-quizs-in-room/:roomId",
  [AuthMiddlesware.verifyToken],
  quizController.getAllQuizsInRoom
);

quizRouter.post(
  "/question",
  [AuthMiddlesware.verifyToken],
  quizController.createQuestion
);
quizRouter.put(
  "/question/:questionId",
  [AuthMiddlesware.verifyToken],
  quizController.updateQuestion
);
quizRouter.delete(
  "/question/:questionId",
  [AuthMiddlesware.verifyToken],
  quizController.deleteQuestion
);
quizRouter.get(
  "/question/get-by-questionId-and-submissionId",
  [AuthMiddlesware.verifyToken],
  quizController.getQuestionByIdAndSubmissionId
);
quizRouter.get(
  "/question/:questionId",
  [AuthMiddlesware.verifyToken],
  quizController.getQuestionById
);
quizRouter.get(
  "/question/get-all-questions-in-quiz/:quizId",
  [AuthMiddlesware.verifyToken],
  quizController.getAllQuestionsInQuiz
);
quizRouter.get(
  "/question/get-all-brief-questions-in-quiz/:quizId",
  [AuthMiddlesware.verifyToken],
  quizController.getAllBriefQuestionInQuiz
);

export default quizRouter;
