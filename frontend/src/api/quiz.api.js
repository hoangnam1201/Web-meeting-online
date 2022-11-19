import instance from "./instanceAxios";

export const createQuizApi = (data) => {
  return instance.post("/quiz", data);
};

export const updateQuizApi = (id, data) => {
  return instance.put("/quiz/" + id, data);
};

export const getAllQuizApi = (id) => {
  return instance.get("/quiz/get-all-quizs-in-room/" + id);
};

export const getQuizById = (id) => {
  return instance.get("/quiz/" + id);
};

export const deleteQuizApi = (id) => {
  return instance.delete("/quiz/" + id);
};

export const createQuestionApi = (data) => {
  return instance.post("/quiz/question", data);
};

export const updateQuestionApi = (id, data) => {
  return instance.put("/quiz/question/" + id, data);
};

export const getAllQuestionApi = (quizId) => {
  return instance.get("/quiz/question/get-all-questions-in-quiz/" + quizId);
};

export const getAllBriefQuestionInQuizAPI = (quizId) => {
  return instance.get("/quiz/question/get-all-brief-questions-in-quiz/" + quizId);
}

export const deleteQuestionApi = (questionId) => {
  return instance.delete("/quiz/question/" + questionId);
};

export const getQuestionByIdAndSubmissionIdAPI = (questionId, submissionId) => {
  return instance.get("/quiz/question/get-by-questionId-and-submissionId", { params: { questionId, submissionId } });
}