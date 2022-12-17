import {
  createQuizApi,
  deleteQuizApi,
  getAllQuizApi,
  getQuizById,
  updateQuizApi,
} from "../../api/quiz.api";
import { toastSuccess } from "../../services/toastService";

export const QUIZ_REQUEST = "QUIZ_REQUEST";
export const QUIZ_SUCCESS = "QUIZ_SUCCESS";
export const QUIZ_SETCURRENT = 'QUIZ_SETCURRENT';
export const QUIZ_ERROR = "QUIZ_ERROR";
export const QUIZ_SELECTED = "QUIZ_SELECTED";

const quizRequest = () => {
  return {
    type: QUIZ_REQUEST,
  };
};

const quizSuccess = (quiz) => {
  return {
    type: QUIZ_SUCCESS,
    payload: quiz,
  };
};

const quizSetCurrent = (quiz) => {
  return {
    type: QUIZ_SETCURRENT,
    payload: quiz,
  };
};
const quizError = (err) => {
  return {
    type: QUIZ_ERROR,
  };
};
const quizSelected = (id) => {
  return {
    type: QUIZ_SELECTED,
    payload: id,
  };
};

export const selectQuizAction = (id, callback) => {
  return (dispatch, getState) => {
    const quizState = getState().quizReducer;
    if (quizState.selectedQuiz === id) {
      dispatch(quizSelected(null));
      return
    }
    dispatch(quizSelected(id));
    if (callback) {
      callback();
    }
  };
};

export const clearSelectQuizAction = ()=>{
  return (dispatch, getState) => {
    const quizState = getState().quizReducer;
    if (quizState.selectedQuiz.length) return dispatch(quizSelected([]))
  };
}

export const getQuizAction = (roomId) => {
  return async (dispatch) => {
    dispatch(quizRequest());
    try {
      const res = await getAllQuizApi(roomId);
      dispatch(quizSuccess(res.data));
    } catch (err) {
      console.log(err);
      if (err.response) {
        dispatch(quizError(err.response));
        return;
      }
      dispatch(quizError("Error network"));
    }
  };
};

export const getQuizByQuizIdAction = (quizId) => {
  return async (dispatch) => {
    dispatch(quizRequest());
    try {
      const res = await getQuizById(quizId);
      dispatch(quizSetCurrent(res.data));
    } catch (err) {
      console.log(err);
      if (err.response) {
        dispatch(quizError(err.response));
        return;
      }
      dispatch(quizError("Error network"));
    }
  };
};

export const addQuizAction = (data, roomId, callback) => {
  return async (dispatch) => {
    dispatch(quizRequest());
    try {
      await createQuizApi(data);
      dispatch(getQuizAction(roomId));
      toastSuccess('successfull')
      if (callback) {
        callback();
      }
    } catch (err) {
      console.log(err);
      if (err.response) {
        dispatch(quizError(err.response));
        return;
      }
      dispatch(quizError("Error network"));
    }
  };
};

export const updateQuizActon = (id, data, callback) => {
  return async (dispatch) => {
    dispatch(quizRequest());
    try {
      await updateQuizApi(id, data);
      dispatch(getQuizAction(data.room));
      dispatch(clearSelectQuizAction())
      toastSuccess('successfull')
      if (callback) {
        callback();
      }
    } catch (err) {
      console.log(err);
      if (err.response) {
        dispatch(quizError(err.response));
        return;
      }
      dispatch(quizError("Error network"));
    }
  };
};

export const deleteQuizAction = (id, roomId) => {
  return async (dispatch) => {
    dispatch(quizRequest());
    try {
      await deleteQuizApi(id);
      dispatch(getQuizAction(roomId));
      toastSuccess('successfull')
    } catch (err) {
      console.log(err);
      if (err.response) {
        dispatch(quizError(err.response));
        return;
      }
      dispatch(quizError("Error network"));
    }
  };
};
