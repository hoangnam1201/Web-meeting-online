import {
  QUIZ_REQUEST,
  QUIZ_SUCCESS,
  QUIZ_ERROR,
  QUIZ_SELECTED,
} from "../actions/quizAction";

const initialState = {
  loading: false,
  err: "",
  data: [],
  selectedQuiz: [],
};

export const quizReducer = (state = initialState, { type, payload }) => {
  switch (type) {
    case QUIZ_REQUEST:
      return { ...state, loading: true };
    case QUIZ_SUCCESS:
      return { ...state, loading: false, data: payload };
    case QUIZ_SELECTED:
      return { ...state, selectedQuiz: payload };
    case QUIZ_ERROR:
      return { ...state, loading: false, err: payload };
    default:
      return state;
  }
};
