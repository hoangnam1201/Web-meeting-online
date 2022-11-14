import { QuizCreateDTO } from "../Dtos/quiz-create.dto";
import { QuizUpdateDTO } from "../Dtos/quiz-update.dto";
import questionModel from "../models/question.model";
import quizModel from "../models/quiz.model";
import submissionModel from "../models/submission.model";

export default () => {
  const createQuiz = (quizData: QuizCreateDTO) => {
    return quizModel.create(quizData);
  };

  const updateQuiz = (id: string, quizData: QuizUpdateDTO) => {
    return quizModel.updateOne({ _id: id }, quizData);
  };

  const deleteQuiz = (id: string) => {
    return Promise.all([
      quizModel.deleteOne({ _id: id }),
      questionModel.deleteMany({ quiz: id }),
      submissionModel.deleteMany({ quiz: id }),
    ]);
  };

  const getAllQuizsInRoom = (roomId: string) => {
    return quizModel.find({ room: roomId });
  };

  const getById = (id: string) => {
    return quizModel.findById(id);
  };

  return {
    createQuiz,
    updateQuiz,
    deleteQuiz,
    getAllQuizsInRoom,
    getById,
  };
};
