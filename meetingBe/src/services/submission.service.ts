import submissionModel, { submission } from "../models/submission.model";
import { ObjectId, Types } from "mongoose";

export default () => {
  const createSubmission = (userId: string, quizId: string) => {
    const submission = {
      userId,
      startDate: new Date().getTime(),
      status: "DOING",
      quiz: quizId,
    };
    return submissionModel.create(submission);
  };

  const changeStateSubmit = (
    submissionId: string,
    state: "SUBMITTED" | "DONING"
  ) => {
    return submissionModel.findOneAndUpdate(
      { _id: submissionId },
      { state },
      { new: true }
    );
  };

  const addAnswer = async (
    submissionId: string,
    answers: { questionId: Types.ObjectId; answerId: Types.ObjectId }[]
  ) => {
    const ids = answers.map(({ questionId }) => questionId);
    await submissionModel.updateOne(
      { _id: submissionId },
      {
        $pull: { answers: { questionId: { $in: ids } } },
      }
    );
    return submissionModel.findByIdAndUpdate(
      { _id: submissionId },
      { $push: { answers } },
      { new: true }
    );
  };

  const getById = (id: string) => {
    return submissionModel.findById(id);
  };

  const getByQuiz = (userId: string, quizId: string) => {
    console.log(userId);
    console.log(quizId);
    return submissionModel.findOne({ userId: userId, quiz: quizId });
  };

  const getSubmissionInQuiz = (quizId: string) => {
    return submissionModel.find({ quiz: quizId });
  };

  const getScoresInQuiz = (quizId: string) => {
    return submissionModel
      .aggregate()
      .match({ quiz: new Types.ObjectId(quizId) })
      .lookup({
        from: "questions",
        localField: "answers.questionId",
        foreignField: "_id",
        as: "questions",
        pipeline: [
          {
            $project: {
              choices: {
                $filter: {
                  input: "$choices",
                  as: "choice",
                  cond: "$$choice.isTrue",
                },
              },
            },
          },
          {
            $addFields: {
              choices: "$choices._id",
            },
          },
        ],
      })
      .unwind("$answers", "$questions")
      .project({
        _id: 1,
        userId: 1,
        quiz: 1,
        isCorrect: {
          $cond: [
            {
              $setEquals: ["$questions.choices", "$answers.answerIds"],
            },
            1,
            0,
          ],
        },
      })
      .group({
        _id: "$_id",
        userId: { $first: "$userId" },
        quiz: { $first: "$quiz" },
        countCorrect: { $sum: "$isCorrect" },
      })
      .lookup({
        from: "questions",
        localField: "quiz",
        foreignField: "quiz",
        as: "countQuestion",
        pipeline: [
          {
            $count: "count",
          },
        ],
      })
      .project({
        _id: 1,
        quiz: 1,
        countCorrect: 1,
        userId: 1,
        countQuestion: { $arrayElemAt: ["$countQuestion.count", 0] },
      })
      .addFields({
        score: {
          $multiply: [{ $divide: ["$countCorrect", "$countQuestion"] }, 100],
        },
      });
  };

  return {
    getById,
    getByQuiz,
    createSubmission,
    changeStateSubmit,
    getSubmissionInQuiz,
    getScoresInQuiz,
    addAnswer,
  };
};
