import { Request, Response } from "express";
import { submissionReadDetailDTO } from "../../Dtos/submission-read-detail.dto";
import { submissionReadDTO } from "../../Dtos/submission-read.dto";
import SubmissionService from "../../services/submission.service";

export default () => {
  const submissionService = SubmissionService();

  const createSubmission = async (req: Request, res: Response) => {
    const { userId } = req.userData;
    const { quizId } = req.params;
    try {
      const submission = await submissionService.createSubmission(
        userId,
        quizId
      );
      res.status(200).json({ status: 200, data: submission });
    } catch {
      return res
        .status(500)
        .json({ status: 500, msg: "Internal Server Error" });
    }
  };

  const getScoresInQuiz = async (req: Request, res: Response) => {
    const { quizId } = req.params;
    const { take = 0, page = 0 } = req.query;
    try {
      const submissionData = await submissionService.getScoresInQuiz(
        quizId,
        parseInt(take.toString()),
        parseInt(page.toString())
      );
      res.status(200).json({
        status: 200,
        data: {
          ...submissionData[0],
          count: submissionData[0].count || 0,
        },
      });
    } catch (e) {
      console.log(e);
      return res
        .status(500)
        .json({ status: 500, msg: "Internal Server Error" });
    }
  };

  const getScoresByQuiz = async (req: Request, res: Response) => {
    const { quizId } = req.params;
    const { userId } = req.userData;
    try {
      const submissions = await submissionService.getScoresByQuiz(
        quizId,
        userId
      );
      res.status(200).json({ status: 200, data: submissions });
    } catch (e) {
      console.log(e);
      return res
        .status(500)
        .json({ status: 500, msg: "Internal Server Error" });
    }
  };

  const getSubmissionInQuiz = async (req: Request, res: Response) => {
    const { quizId } = req.params;
    try {
      const submissions = await submissionService.getSubmissionInQuiz(quizId);
      res.status(200).json({
        status: 200,
        data: submissionReadDTO.fromArray(submissions),
      });
    } catch (e) {
      console.log(e);
      return res
        .status(500)
        .json({ status: 500, msg: "Internal Server Error" });
    }
  };

  const submitAnswers = async (req: Request, res: Response) => {
    const { submissionId } = req.params;
    const { data } = req.body;
    try {
      const submission = await submissionService.addAnswer(submissionId, data);
      res.status(200).json({
        status: 200,
        data: submissionReadDetailDTO.fromSubmission(submission),
      });
    } catch (e) {
      console.log(e);
      return res
        .status(500)
        .json({ status: 500, msg: "Internal Server Error" });
    }
  };

  const submitSubmission = async (req: Request, res: Response) => {
    const { submissionId } = req.params;
    try {
      const submission = await submissionService.changeStateSubmit(
        submissionId,
        "SUBMITTED"
      );
      res.status(200).json({
        status: 200,
        data: submissionReadDetailDTO.fromSubmission(submission),
      });
    } catch {
      return res
        .status(500)
        .json({ status: 500, msg: "Internal Server Error" });
    }
  };

  const getSubmissionById = async (req: Request, res: Response) => {
    const { submissionId } = req.params;
    try {
      const submission = await submissionService.getById(submissionId);
      res.status(200).json({
        status: 200,
        data: submissionReadDetailDTO.fromSubmission(submission),
      });
    } catch {
      return res
        .status(500)
        .json({ status: 500, msg: "Internal Server Error" });
    }
  };

  const getSubmissionByQuiz = async (req: Request, res: Response) => {
    const { quizId } = req.params;
    const { userId } = req.userData;
    try {
      const submissions = await submissionService.getByQuiz(userId, quizId);
      res.status(200).json({
        status: 200,
        data: submissionReadDetailDTO.fromArray(submissions),
      });
    } catch (e) {
      console.log(e);
      return res
        .status(500)
        .json({ status: 500, msg: "Internal Server Error" });
    }
  };

  return {
    getSubmissionInQuiz,
    getScoresInQuiz,
    getScoresByQuiz,
    getSubmissionById,
    getSubmissionByQuiz,
    submitSubmission,
    createSubmission,
    submitAnswers,
  };
};
