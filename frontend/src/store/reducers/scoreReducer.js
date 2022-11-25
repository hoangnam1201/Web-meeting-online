import { SCORE_LOADING, SCORE_SUCCESS } from "../actions/scoreAction"

const initState = {
  countRecords: 0,
  records: [],
  loading: false,
}

export const scoreReducer = (state = initState, { type, payload }) => {
  switch (type) {
    case SCORE_LOADING:
      return { ...state, loading: true }
    case SCORE_SUCCESS:
      const { records, count } = payload
      return { ...state, records, countRecords: count, loading: false }
    default:
      return state
  }
}