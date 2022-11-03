import { QuestionCreateDTO } from "../Dtos/question-create.dto";
import { QuestionUpdateDTO } from "../Dtos/question-update.dto";
import questionModel from "../models/question.model";

export default () => {
  const createQuestion = (question: QuestionCreateDTO) => {
    return questionModel.create(question);
  };

  const updateQuestion = (id: string, question: QuestionUpdateDTO) => {
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

  return {
    createQuestion,
    updateQuestion,
    deleteQuestion,
    getById,
    getAllQuestionInQuiz,
  };
};
