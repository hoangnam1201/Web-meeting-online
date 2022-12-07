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
    status: "SUBMITTED" | "DONING"
  ) => {
    return submissionModel.findOneAndUpdate(
      { _id: submissionId },
      { status },
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
    return submissionModel.find({ userId: userId, quiz: quizId });
  };

  const getCountByQuiz = (userId: string, quizId: string) => {
    return submissionModel.countDocuments({ userId: userId, quiz: quizId });
  };

  const getSubmissionInQuiz = (quizId: string) => {
    return submissionModel.find({ quiz: quizId });
  };

  const getScoresByQuiz = (quizId: string, userId: string) => {
    return submissionModel
      .aggregate()
      .match({
        quiz: new Types.ObjectId(quizId),
        userId: new Types.ObjectId(userId),
      })
      .addFields({
        answers: {
          $map: {
            input: "$answers",
            as: "answer",
            in: {
              questionId: "$$answer.questionId",
              answers: {
                $map: {
                  input: "$$answer.answers",
                  as: "a",
                  in: {
                    answerId: "$$a.answerId",
                    content: {
                      $concat: [{ $toString: "$$a.answerId" }, "$$a.content"],
                    },
                  },
                },
              },
            },
          },
        },
      })
      .lookup({
        from: "questions",
        localField: "answers.questionId",
        foreignField: "_id",
        as: "questions",
        pipeline: [
          {
            $match: {
              $expr: {
                $or: [
                  { $eq: ["$type", "ONE"] },
                  { $eq: ["$type", "MULTIPLE"] },
                  { $eq: ["$type", "FILLIN"] },
                ],
              },
            },
          },
          {
            $project: {
              type: 1,
              choices: {
                $map: {
                  input: {
                    $filter: {
                      input: "$choices",
                      as: "choice",
                      cond: {
                        $and: ["$$choice.isTrue"],
                      },
                    },
                  },
                  as: "c",
                  in: {
                    _id: "$$c._id",
                    content: {
                      $concat: [{ $toString: "$$c._id" }, "$$c.content"],
                    },
                  },
                },
              },
            },
          },
        ],
      })
      .unwind(
        { path: "$answers", preserveNullAndEmptyArrays: true },
        { path: "$questions", preserveNullAndEmptyArrays: true }
      )
      .addFields({
        isCorrect: {
          $cond: [
            {
              $or: [
                {
                  $and: [
                    {
                      $eq: ["$questions.type", "FILLIN"],
                    },
                    {
                      $setEquals: [
                        "$questions.choices.content",
                        "$answers.answers.content",
                      ],
                    },
                  ],
                },
                {
                  $and: [
                    {
                      $or: [
                        { $eq: ["$questions.type", "ONE"] },
                        { $eq: ["$questions.type", "MULTIPLE"] },
                      ],
                    },
                    {
                      $setEquals: [
                        "$questions.choices._id",
                        "$answers.answers.answerId",
                      ],
                    },
                  ],
                },
              ],
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
        status: { $first: "$status" },
        startDate: { $first: "$startDate" },
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
        startDate: 1,
        status: 1,
        countQuestion: { $arrayElemAt: ["$countQuestion.count", 0] },
      })
      .sort({ startDate: 1 })
      .addFields({
        score: {
          $multiply: [{ $divide: ["$countCorrect", "$countQuestion"] }, 100],
        },
      });
  };

  const getScoresInQuiz = (quizId: string, take: number, page: number) => {
    return submissionModel
      .aggregate()
      .match({ quiz: new Types.ObjectId(quizId) })
      .addFields({
        answers: {
          $map: {
            input: "$answers",
            as: "answer",
            in: {
              questionId: "$$answer.questionId",
              answers: {
                $map: {
                  input: "$$answer.answers",
                  as: "a",
                  in: {
                    answerId: "$$a.answerId",
                    content: {
                      $concat: [{ $toString: "$$a.answerId" }, "$$a.content"],
                    },
                  },
                },
              },
            },
          },
        },
      })
      .lookup({
        from: "questions",
        localField: "answers.questionId",
        foreignField: "_id",
        as: "questions",
        pipeline: [
          {
            $match: {
              $expr: {
                $or: [
                  { $eq: ["$type", "ONE"] },
                  { $eq: ["$type", "MULTIPLE"] },
                  { $eq: ["$type", "FILLIN"] },
                ],
              },
            },
          },
          {
            $project: {
              type: 1,
              choices: {
                $map: {
                  input: {
                    $filter: {
                      input: "$choices",
                      as: "choice",
                      cond: {
                        $and: ["$$choice.isTrue"],
                      },
                    },
                  },
                  as: "c",
                  in: {
                    _id: "$$c._id",
                    content: {
                      $concat: [{ $toString: "$$c._id" }, "$$c.content"],
                    },
                  },
                },
              },
            },
          },
        ],
      })
      .unwind(
        { path: "$answers", preserveNullAndEmptyArrays: true },
        { path: "$questions", preserveNullAndEmptyArrays: true }
      )
      .addFields({
        isCorrect: {
          $cond: [
            {
              $or: [
                {
                  $and: [
                    {
                      $eq: ["$questions.type", "FILLIN"],
                    },
                    {
                      $setEquals: [
                        "$questions.choices.content",
                        "$answers.answers.content",
                      ],
                    },
                  ],
                },
                {
                  $and: [
                    {
                      $or: [
                        { $eq: ["$questions.type", "ONE"] },
                        { $eq: ["$questions.type", "MULTIPLE"] },
                      ],
                    },
                    {
                      $setEquals: [
                        "$questions.choices._id",
                        "$answers.answers.answerId",
                      ],
                    },
                  ],
                },
              ],
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
        status: { $first: "$status" },
        startDate: { $first: "$startDate" },
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
        startDate: 1,
        status: 1,
        countQuestion: { $arrayElemAt: ["$countQuestion.count", 0] },
      })
      .lookup({
        from: "users",
        localField: "userId",
        foreignField: "_id",
        as: "user",
        pipeline: [{ $project: { name: 1, _id: 1, email: 1 } }],
      })
      .addFields({ user: { $arrayElemAt: ["$user", 0] } })
      .sort({ startDate: 1, userId: 1 })
      .addFields({
        score: {
          $multiply: [{ $divide: ["$countCorrect", "$countQuestion"] }, 100],
        },
      })
      .facet({
        count: [{ $count: "count" }],
        records: [{ $skip: take * page }, { $limit: take }],
      })
      .addFields({ count: { $arrayElemAt: ["$count.count", 0] } });
  };

  const getAnswers = (submissionId: string) => {
    return submissionModel
      .findById(submissionId)
      .populate("answers.questionId");
  };

  const getSubmissionAnswers = (quizId: string) => {
    return submissionModel
      .find({ quiz: quizId })
      .populate("answers.questionId")
      .populate("userId");
  };

  return {
    getSubmissionAnswers,
    getAnswers,
    getById,
    getByQuiz,
    getCountByQuiz,
    createSubmission,
    changeStateSubmit,
    getSubmissionInQuiz,
    getScoresByQuiz,
    getScoresInQuiz,
    addAnswer,
  };
};
