import { SUBMISSION_QUESTIONLOADING, SUBMISSION_QUESTIONSLOADING, SUBMISSION_QUIZLOADING, SUBMISSION_SETCURRENTSUBMISSION, SUBMISSION_SETQUESTION, SUBMISSION_SETQUESTIONS, SUBMISSION_SETQUIZDETAIL, SUBMISSION_SETSUBMISSIONS, SUBMISSION_SUBMISSIONLOADING } from "../actions/submissionAction"

let initState = {
  quizDetail: null,
  currentSubmission: null,
  submissions: null,
  quizLoading: false,
  submissionLoading: false,
  questionLoading: false,
  questionsLoading: false,
  questions: [],
  currentQuestion: null,
}

export const submissionReducer = (state = initState, { type, payload }) => {
  switch (type) {
    case SUBMISSION_QUIZLOADING:
      return { ...state, quizLoading: true };
    case SUBMISSION_QUESTIONLOADING:
      return { ...state, questionLoading: true, currentQuestion: null };
    case SUBMISSION_QUESTIONSLOADING:
      return { ...state, questionsLoading: true, questions: [] };
    case SUBMISSION_SUBMISSIONLOADING:
      return { ...state, submissionLoading: true };
    case SUBMISSION_SETQUIZDETAIL:
      return { ...state, quizDetail: payload, quizLoading: false };
    case SUBMISSION_SETQUESTIONS:
      return { ...state, questions: payload, questionsLoading: false};
    case SUBMISSION_SETQUESTION:
      return { ...state, currentQuestion: payload, questionLoading: false};
    case SUBMISSION_SETCURRENTSUBMISSION:
      return { ...state, currentSubmission: payload, submissionLoading: false };
    case SUBMISSION_SETSUBMISSIONS:
      return { ...state, submissions: payload, submissionLoading: false };
    default:
      return state
  }
}