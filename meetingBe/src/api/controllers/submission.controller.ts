import { Request, Response } from "express";
import { submissionReadDetailDTO } from "../../Dtos/submission-read-detail.dto";
import { submissionReadDTO } from "../../Dtos/submission-read.dto";
import { Question } from "../../models/question.model";
import FileService from "../../services/file.service";
import SubmissionService from "../../services/submission.service";
import { User } from "../../models/user.model";

export default () => {
  const submissionService = SubmissionService();
  const fileService = FileService();

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

  const downloadSubmission = async (req: Request, res: Response) => {
    const { submissionId } = req.params;
    try {
      const submission = await submissionService.getAnswers(submissionId);
      if (!submission)
        return res.status(400).json({ status: 400, msg: "not found" });

      const answers = submission.answers.reduce((result: any, a) => {
        const question = a.questionId as Question;
        if (question.type === "MULTIPLE" || question.type === "ONE") {
          const answer = question.choices.reduce((total, c) => {
            if (
              a.answers.findIndex(
                (aa) => c._id.toString() === aa.answerId.toString()
              ) !== -1
            )
              return total + c.content + "\n";
            return total;
          }, []);
          result = [...result, { question: question.content, answer }];
          return result;
        }
        if (question.type === "ESSAY") {
          result = [...result, { question: question.content, answer: a.essay }];
          return result;
        }
        //type === fillin
        const answer = a.answers.reduce((total, answer) => {
          return total + answer.content + "\n";
        }, "");
        result = [...result, { question: question.content, answer }];
        return result;
      }, []);
      const stream = fileService.jsonToExcel(answers, []);
      res.setHeader(
        "Content-disposition",
        "attachment; filename=" +
          `submission-${submissionId}-${submission.startDate}.xlsx`
      );
      res.setHeader(
        "Content-type",
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
      );
      stream.pipe(res);
    } catch (err) {
      console.log(err);
      return res.status(500).json({
        status: 500,
        msg: "Internal Server Error",
      });
    }
  };

  const downloadSubmissionInQuiz = async (req: Request, res: Response) => {
    const { quizId } = req.params;

    try {
      const submissions = await submissionService.getSubmissionAnswers(quizId);
      if (submissions.length <= 0)
        return res.status(400).json({ status: 400, msg: "not found" });

      // get buffers
      const data = submissions.reduce((submissionDatas, submission) => {
        const answers = submission.answers.reduce((result: any, a) => {
          const question = a.questionId as Question;
          if (question.type === "MULTIPLE" || question.type === "ONE") {
            const answer = question.choices.reduce((total, c) => {
              if (
                a.answers.findIndex(
                  (aa) => c._id.toString() === aa.answerId.toString()
                ) !== -1
              )
                return total + c.content + "\n";
              return total;
            }, []);
            result = {
              ...result,
              [question._id + ": " + question.content]: answer,
            };
            return result;
          }
          if (question.type === "ESSAY") {
            result = {
              ...result,
              [question._id + ": " + question.content]: a.essay,
            };
            return result;
          }
          //type === fillin
          const answer = a.answers.reduce((total, answer) => {
            return total + answer.content + "\n";
          }, "");
          result = {
            ...result,
            [question._id + ": " + question.content]: answer,
          };
          return result;
        }, {});
        const user = submission.userId as User;
        submissionDatas.push({
          name: user.name,
          email: user.email,
          ...answers,
        });
        return submissionDatas;
      }, []);
      const stream = fileService.jsonToExcel(data, []);

      res.setHeader(
        "Content-disposition",
        `attachment; filename=quiz${quizId}.xlsx`
      );
      res.setHeader(
        "Content-type",
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
      );
      stream.pipe(res);
    } catch {
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
    downloadSubmissionInQuiz,
    getSubmissionInQuiz,
    getScoresInQuiz,
    getScoresByQuiz,
    getSubmissionById,
    getSubmissionByQuiz,
    downloadSubmission,
    submitSubmission,
    createSubmission,
    submitAnswers,
  };
};
