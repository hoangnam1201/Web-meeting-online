import {
  USER_REQUEST,
  USER_ERROR,
  USER_SUCCESS,
  USER_SELECTED,
} from "../actions/userAction";

const initialState = {
  loading: false,
  err: "",
  items: [],
  totalPages: 0,
  currentPage: null,
  selectedUser: [],
};

export const userManageReducer = (state = initialState, { type, payload }) => {
  switch (type) {
    case USER_REQUEST:
      return { ...state, loading: true };
    case USER_SUCCESS:
      const { totalPages, currentPage, items } = payload;
      return { ...state, loading: false, items, totalPages, currentPage };
    case USER_SELECTED:
      return { ...state, loading: false, selectedUser: payload };
    case USER_ERROR:
      return { ...state, loading: false, err: payload };
    default:
      return state;
  }
};
