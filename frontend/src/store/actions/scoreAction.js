import { getScoresInQuizAPI } from "../../api/submission.api";
import { toastError } from "../../services/toastService";

export const SCORE_SUCCESS = 'SCORE_SUCCESS';
export const SCORE_LOADING = 'SCORE_LOADING';

const scoreSuccess = (scoresData) => ({
  type: SCORE_SUCCESS,
  payload: scoresData
})

const scoreLoading = () => ({
  type: SCORE_LOADING
})

export const getScoresAction = (quizId, take = 10, page = 0) => {
  return async (dispatch) => {
    dispatch(scoreLoading())
    try {
      const res = await getScoresInQuizAPI(quizId, take, page);
      dispatch(scoreSuccess(res.data));
    } catch (e) {
      toastError(e?.response?.data?.msg)
    }
  }
}