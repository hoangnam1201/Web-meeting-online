import { getAllBriefQuestionInQuizAPI, getQuestionByIdAndSubmissionIdAPI, getQuizById } from "../../api/quiz.api";
import { createSubmissionAPI, getMyCoresAPI, getSubmissionByIdAPI, getSubmissionByQuizIdAPI, submitAnswerAPI, submitSubmissionAPI } from "../../api/submission.api";
import { toastError } from "../../services/toastService";

export const SUBMISSION_QUIZLOADING = 'SUBMISSION_QUIZLOADING';
export const SUBMISSION_QUESTIONLOADING = 'SUBMISSION_QUESTIONLOADING';
export const SUBMISSION_QUESTIONSLOADING = 'SUBMISSION_QUESTIONLOADING';
export const SUBMISSION_SUBMISSIONLOADING = 'SUBMISSION_SUBMISSIONLOADING'
export const SUBMISSION_SETQUIZDETAIL = 'SUBMISSION_SETQUIZDETAIL';
export const SUBMISSION_SETSUBMISSIONS = 'SUBMISSION_SETSUBMISSIONS';
export const SUBMISSION_SETQUESTIONS = 'SUBMISSION_SETQUESTIONS';
export const SUBMISSION_SETQUESTION = 'SUBMISSION_SETQUESTION';
export const SUBMISSION_SETCURRENTSUBMISSION = 'SUBMISSION_SETCURRENTSUBMISSION';

const quizLoading = () => ({
  type: SUBMISSION_QUIZLOADING
})

const questionLoading = () => ({
  type: SUBMISSION_QUESTIONLOADING
})

const questionsLoading = () => ({
  type: SUBMISSION_QUESTIONSLOADING
})

const submissionLoading = () => ({
  type: SUBMISSION_SUBMISSIONLOADING
})

const setQuizDetail = (quiz) => ({
  type: SUBMISSION_SETQUIZDETAIL,
  payload: quiz
})

const setSubmissions = (submissions) => ({
  type: SUBMISSION_SETSUBMISSIONS,
  payload: submissions
})

const setQuestions = (questions) => ({
  type: SUBMISSION_SETQUESTIONS,
  payload: questions
})

const setQuestion = (question) => ({
  type: SUBMISSION_SETQUESTION,
  payload: question
})

const setCurrentSubmission = (submission) => ({
  type: SUBMISSION_SETCURRENTSUBMISSION,
  payload: submission
})

export const submissionGetQuizDetail = (quizId) => {
  return async (dispatch) => {
    dispatch(quizLoading())
    try {
      const res = await getQuizById(quizId);
      dispatch(setQuizDetail(res.data));
    } catch (e) {
      toastError(e.response?.data?.msg)
    }
  }
}

export const submissionGetSubmissions = (quizId) => {
  return async (dispatch) => {
    dispatch(submissionLoading())
    try {
      const res = await getMyCoresAPI(quizId);
      dispatch(setSubmissions(res.data));
    } catch (e) {
      toastError(e.response?.data?.msg)
    }
  }
}

export const submissionGetQuestions = (quizId) => {
  return async (dispatch) => {
    dispatch(questionsLoading())
    try {
      const res = await getAllBriefQuestionInQuizAPI(quizId);
      if (res.data[0]) {
        dispatch(submissionGetCurrentQuestion(res.data[0]._id))
      }
      dispatch(setQuestions(res.data));
    } catch (e) {
      toastError(e.response?.data?.msg)
    }
  }
}

export const submissionCreateSubmissions = (quizId) => {
  return async (dispatch) => {
    dispatch(submissionLoading())
    try {
      const res = await createSubmissionAPI(quizId);
      dispatch(setCurrentSubmission(res.data));
    } catch (e) {
      toastError(e.response?.data?.msg)
    }
  }
}

export const submissionGetCurrentSubmission = (submissionId) => {
  return async (dispatch) => {
    dispatch(submissionLoading())
    try {
      const res = await getSubmissionByIdAPI(submissionId);
      dispatch(setCurrentSubmission(res.data));
    } catch (e) {
      toastError(e.response?.data?.msg)
    }
  }
}

export const submissionGetCurrentQuestion = (questionId, answer) => {
  return async (dispatch, getState) => {
    try {
      const submissionState = getState().submissionReducer;
      if (submissionState.currentQuestion && answer) {
        dispatch(submissionSubmitQuestion({
          ...answer,
          questionId: submissionState.currentQuestion._id
        }))
      }
      dispatch(questionLoading())
      const res = await getQuestionByIdAndSubmissionIdAPI(questionId, submissionState.currentSubmission._id);
      console.log(res)
      dispatch(setQuestion(res.data));
    } catch (e) {
      toastError(e.response?.data?.msg)
    }
  }
}

const submissionSubmitQuestion = (answer) => {
  return async (dispatch, getState) => {
    if (!answer) return;
    try {
      const submissionState = getState().submissionReducer;
      if (submissionState?.currentSubmission) {
        const res = await submitAnswerAPI(submissionState?.currentSubmission._id, answer);
        dispatch(setCurrentSubmission(res.data));
      }

    } catch (e) {
      toastError(e.response?.data?.msg)
    }
  }
}

export const submissionSubmitSubmissionAction = (answer) => {
  return async (dispatch, getState) => {
    try {
      const submissionState = getState().submissionReducer;
      if (submissionState.currentQuestion && answer) {
        dispatch(submissionSubmitQuestion({
          ...answer,
          questionId: submissionState.currentQuestion._id
        }))
      }
      if (submissionState?.currentSubmission) {
        const res = await submitSubmissionAPI(submissionState?.currentSubmission._id);
        dispatch(setCurrentSubmission(res.data));
      }
    } catch (e) {
      toastError(e.response?.data?.msg)
    }
  }
}