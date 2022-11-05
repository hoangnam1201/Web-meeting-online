import {
  QUESTION_REQUEST,
  QUESTION_SUCCESS,
  QUESTION_ERROR,
  QUESTION_SELECTED,
} from "../actions/questionAction";

const initialState = {
  loading: false,
  err: "",
  data: [],
  selectedQuestion: null,
};

export const questionReducer = (state = initialState, { type, payload }) => {
  switch (type) {
    case QUESTION_REQUEST:
      return { ...state, loading: true };
    case QUESTION_SUCCESS:
      return { ...state, loading: false, data: payload };
    case QUESTION_SELECTED:
      return { ...state, selectedQuestion: payload };
    case QUESTION_ERROR:
      return { ...state, loading: false, err: payload };
    default:
      return state;
  }
};
