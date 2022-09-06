import {
  TABLE_ERROR,
  TABLE_REQUEST,
  TABLE_SELECT_FLOOR,
  TABLE_SUCCESS,
} from "../actions/tableActions";

const initState = {
  loading: false,
  error: null,
  currentFloor: null,
  items: [],
};

export const TablesReducer = (state = initState, { type, payload }) => {
  switch (type) {
    case TABLE_REQUEST:
      return { ...state, loading: true };
    case TABLE_SUCCESS:
      return { ...state, loading: false, items: payload };
    case TABLE_ERROR:
      return { ...state, loading: false, error: payload };
    case TABLE_SELECT_FLOOR:
      return { ...state, currentFloor: payload };
    default:
      return { ...state };
  }
};
