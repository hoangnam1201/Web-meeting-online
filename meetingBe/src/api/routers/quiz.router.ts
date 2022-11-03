import { Router } from "express";
import QuizController from "../controllers/quiz.controller";
import AuthMiddlesware from "../middlewares/auth.middleware";

const quizRouter = Router();
const quizController = QuizController();

quizRouter.post("", [AuthMiddlesware.verifyToken], quizController.createQuiz);
quizRouter.put(
  "/:quizId",
  [AuthMiddlesware.verifyToken],
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
  "/question/:questionId",
  [AuthMiddlesware.verifyToken],
  quizController.getQuestionById
);
quizRouter.get(
  "/question/get-all-questions-in-quiz/:quizId",
  [AuthMiddlesware.verifyToken],
  quizController.getAllQuestionsInQuiz
);

export default quizRouter;
