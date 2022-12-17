import {
  createQuestionApi,
  deleteQuestionApi,
  getAllQuestionApi,
  updateQuestionApi,
} from "../../api/quiz.api";
import { toastSuccess } from "../../services/toastService";

export const QUESTION_REQUEST = "QUESTION_REQUEST";
export const QUESTION_SUCCESS = "QUESTION_SUCCESS";
export const QUESTION_ERROR = "QUESTION_ERROR";
export const QUESTION_SELECTED = "QUESTION_SELECTED";

const questionRequest = () => {
  return {
    type: QUESTION_REQUEST,
  };
};

const questionSuccess = (question) => {
  return {
    type: QUESTION_SUCCESS,
    payload: question,
  };
};
const questionError = (err) => {
  return {
    type: QUESTION_ERROR,
  };
};
const questionSelected = (id) => {
  return {
    type: QUESTION_SELECTED,
    payload: id,
  };
};

export const selectQuestionAction = (id, callback) => {
  return (dispatch) => {
    dispatch(questionSelected(id));
    if (callback) {
      callback();
    }
  };
};
export const getQuestionAction = (quizId) => {
  return async (dispatch) => {
    dispatch(questionRequest());
    try {
      const res = await getAllQuestionApi(quizId);
      dispatch(questionSuccess(res.data));
    } catch (err) {
      console.log(err);
      if (err.response) {
        dispatch(questionError(err.response));
        return;
      }
      dispatch(questionError("Error network"));
    }
  };
};
export const addQuestionAction = (data, quizId, callback) => {
  return async (dispatch) => {
    dispatch(questionRequest());
    try {
      await createQuestionApi(data);
      dispatch(getQuestionAction(quizId));
      toastSuccess('Created successfull')
      callback();
    } catch (err) {
      console.log(err);
      if (err.response) {
        dispatch(questionError(err.response));
        return;
      }
      dispatch(questionError("Error network"));
    }
  };
};

export const updateQuestionActon = (id, data) => {
  return async (dispatch) => {
    dispatch(questionRequest());
    try {
      await updateQuestionApi(id, data);
      toastSuccess('Updated question successfull')
      dispatch(getQuestionAction(data.quiz));
    } catch (err) {
      console.log(err);
      if (err.response) {
        dispatch(questionError(err.response));
        return;
      }
      dispatch(questionError("Error network"));
    }
  };
};

export const deleteQuestionAction = (questionId, quizId) => {
  return async (dispatch) => {
    dispatch(questionRequest());
    try {
      await deleteQuestionApi(questionId);
      dispatch(getQuestionAction(quizId));
      dispatch(selectQuestionAction(null));
    } catch (err) {
      console.log(err);
      if (err.response) {
        dispatch(questionError(err.response));
        return;
      }
      dispatch(questionError("Error network"));
    }
  };
};
