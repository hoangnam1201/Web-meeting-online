import { Types } from "mongoose";
import { QuestionCreateDTO } from "../Dtos/question-create.dto";
import { QuestionUpdateDTO } from "../Dtos/question-update.dto";
import questionModel from "../models/question.model";

export default () => {
  const createQuestion = (question: QuestionCreateDTO) => {
    return questionModel.create(question);
  };

  const updateQuestion = (id: string, question: QuestionUpdateDTO) => {
    console.log(question);
    return questionModel.updateOne({ _id: id }, question);
  };

  const deleteQuestion = (id: string) => {
    return questionModel.deleteOne({ _id: id });
  };

  const getAllQuestionInQuiz = (quizId: string) => {
    return questionModel.find({ quiz: quizId });
  };

  const getById = (id: string) => {
    return questionModel.findById(id);
  };

  const getByIdAndSubmissionId = (id: string, submissionId: string) => {
    return questionModel
      .aggregate()
      .match({ _id: new Types.ObjectId(id) })
      .lookup({
        from: "submissions",
        let: { questionId: "$_id" },
        pipeline: [
          {
            $match: {
              $expr: {
                $eq: [{ $toString: "$_id" }, submissionId],
              },
            },
          },
          {
            $project: {
              answer: {
                $first: {
                  $filter: {
                    input: "$answers",
                    as: "answer",
                    cond: { $eq: ["$$answer.questionId", "$$questionId"] },
                  },
                },
              },
            },
          },
        ],
        as: "submission",
      })
      .addFields({ submission: { $first: "$submission" } });
  };

  return {
    createQuestion,
    updateQuestion,
    deleteQuestion,
    getById,
    getAllQuestionInQuiz,
    getByIdAndSubmissionId,
  };
};
