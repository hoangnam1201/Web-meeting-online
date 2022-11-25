import instance from "./instanceAxios";

export const getSubmissionByQuizIdAPI = (quizId) => {
  return instance.get('/submission/submission-by-quiz/' + quizId);
}

export const getSubmissionInQuizIdAPI = (quizId) => {
  return instance.get('/submission/submission-In-quiz/' + quizId);
}

export const createSubmissionAPI = (quizId, submission) => {
  return instance.post('/submission/' + quizId, submission)
}

export const getSubmissionByIdAPI = (submissionId) => {
  return instance.get('/submission/' + submissionId)
}

export const submitAnswerAPI = (submissionId, data) => {
  return instance.post('/submission/submit-answers/' + submissionId, { data: [data] })
}

export const getMyCoresAPI = (quizId) => {
  return instance.get('/submission/my-scores/' + quizId)
}

export const getScoresInQuizAPI = (quizId, take, page) => {
  return instance.get('/submission/scores/' + quizId, { params: { take, page } })
}

export const submitSubmissionAPI = (submissionId) => {
  return instance.put('/submission/submit/' + submissionId)
}