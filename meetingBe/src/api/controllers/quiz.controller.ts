import { Request, Response } from "express";
import { validationResult } from "express-validator";
import { QuestionBriefReadDTO } from "../../Dtos/question-brief-read.dto";
import { QuestionCreateDTO } from "../../Dtos/question-create.dto";
import { QuestionReadDTO } from "../../Dtos/question-read.dto";
import { QuestionUpdateDTO } from "../../Dtos/question-update.dto";
import { QuizCreateDTO } from "../../Dtos/quiz-create.dto";
import { QuizReadDTO } from "../../Dtos/quiz-read.dto";
import { QuizUpdateDTO } from "../../Dtos/quiz-update.dto";
import QuestionService from "../../services/question.service";
import QuizService from "../../services/quiz.service";

export default () => {
  const quizService = QuizService();
  const questionService = QuestionService();
  const createQuiz = async (req: Request, res: Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ status: 400, errors: errors.array() });
    }
    try {
      const quizCreate = QuizCreateDTO.fromQuiz(req.body);
      await quizService.createQuiz(quizCreate);
      return res.status(200).json({ status: 200, data: null });
    } catch {
      return res.status(500).json({
        status: 500,
        msg: "Internal Server Error",
      });
    }
  };

  const updateQuiz = async (req: Request, res: Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ status: 400, errors: errors.array() });
    }

    try {
      const quizId = req.params.quizId;
      const quizUpdate = QuizUpdateDTO.fromQuiz(req.body);
      await quizService.updateQuiz(quizId, quizUpdate);
      return res.status(200).json({ status: 200, data: null });
    } catch {
      return res.status(500).json({
        status: 500,
        msg: "Internal Server Error",
      });
    }
  };

  const deleteQuiz = async (req: Request, res: Response) => {
    const quizId = req.params.quizId;
    try {
      await quizService.deleteQuiz(quizId);
      return res.status(200).json({ status: 200, data: null });
    } catch {
      return res.status(500).json({
        status: 500,
        msg: "Internal Server Error",
      });
    }
  };

  const createQuestion = async (req: Request, res: Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ status: 400, errors: errors.array() });
    }
    try {
      const questionCreate = QuestionCreateDTO.fromQuestion(req.body);
      await questionService.createQuestion(questionCreate);
      return res.status(200).json({ status: 200, data: null });
    } catch (e) {
      console.log(e);
      return res.status(500).json({
        status: 500,
        msg: "Internal Server Error",
      });
    }
  };

  const updateQuestion = async (req: Request, res: Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ status: 400, errors: errors.array() });
    }

    try {
      const questionId = req.params.questionId;
      const questionUpdate = QuestionUpdateDTO.fromQuestion(req.body);
      await questionService.updateQuestion(questionId, questionUpdate);
      return res.status(200).json({ status: 200, data: null });
    } catch {
      return res.status(500).json({
        status: 500,
        msg: "Internal Server Error",
      });
    }
  };

  const deleteQuestion = async (req: Request, res: Response) => {
    try {
      const questionId = req.params.questionId;
      await questionService.deleteQuestion(questionId);
      return res.status(200).json({ status: 200, data: null });
    } catch {
      return res.status(500).json({
        status: 500,
        msg: "Internal Server Error",
      });
    }
  };

  const getAllQuestionsInQuiz = async (req: Request, res: Response) => {
    try {
      const quizId = req.params.quizId;
      const questions = await questionService.getAllQuestionInQuiz(quizId);
      return res
        .status(200)
        .json({ status: 200, data: QuestionReadDTO.fromList(questions) });
    } catch (e) {
      console.log(e);
      return res.status(500).json({
        status: 500,
        msg: "Internal Server Error",
      });
    }
  };

  const getAllBriefQuestionInQuiz = async (req: Request, res: Response) => {
    try {
      const quizId = req.params.quizId;
      const questions = await questionService.getAllQuestionInQuiz(quizId);
      return res
        .status(200)
        .json({ status: 200, data: QuestionBriefReadDTO.fromList(questions) });
    } catch (e) {
      console.log(e);
      return res.status(500).json({
        status: 500,
        msg: "Internal Server Error",
      });
    }
  };

  const getQuestionById = async (req: Request, res: Response) => {
    try {
      const questionId = req.params.questionId;
      const question = await questionService.getById(questionId);
      return res
        .status(200)
        .json({ status: 200, data: QuestionReadDTO.fromQuestion(question) });
    } catch {
      return res.status(500).json({
        status: 500,
        msg: "Internal Server Error",
      });
    }
  };

  const getQuestionByIdAndSubmissionId = async (
    req: Request,
    res: Response
  ) => {
    try {
      const { questionId, submissionId } = req.query;
      const question = await questionService.getByIdAndSubmissionId(
        questionId.toString(),
        submissionId.toString()
      );
      return res.status(200).json({ status: 200, data: question[0] });
    } catch (e) {
      console.log(e);
      return res.status(500).json({
        status: 500,
        msg: "Internal Server Error",
      });
    }
  };

  const getAllQuizsInRoom = async (req: Request, res: Response) => {
    try {
      const roomId = req.params.roomId;
      const quizs = await quizService.getAllQuizsInRoom(roomId);
      return res
        .status(200)
        .json({ status: 200, data: QuizReadDTO.fromList(quizs) });
    } catch (e) {
      console.log(e);
      return res.status(500).json({
        status: 500,
        msg: "Internal Server Error",
      });
    }
  };

  const getQuizById = async (req: Request, res: Response) => {
    try {
      const quizId = req.params.quizId;
      const quiz = await quizService.getById(quizId);
      return res
        .status(200)
        .json({ status: 200, data: QuizReadDTO.fromQuiz(quiz) });
    } catch (e) {
      console.log(e);
      return res.status(500).json({
        status: 500,
        msg: "Internal Server Error",
      });
    }
  };

  return {
    createQuiz,
    updateQuiz,
    deleteQuiz,
    createQuestion,
    updateQuestion,
    deleteQuestion,
    getAllQuestionsInQuiz,
    getAllBriefQuestionInQuiz,
    getQuestionByIdAndSubmissionId,
    getQuestionById,
    getAllQuizsInRoom,
    getQuizById,
  };
};
