import { ROOM_ERROR, ROOM_REQUEST, ROOM_SUCCESS } from "../actions/roomAction";

const initialState = {
  loading: false,
  err: "",
  items: [],
  totalPages: 0,
  currentPage: null,
};

export const roomManageReducer = (state = initialState, { type, payload }) => {
  switch (type) {
    case ROOM_REQUEST:
      return { ...state, loading: true };
    case ROOM_SUCCESS:
      const { totalPages, currentPage, items } = payload;
      return { ...state, loading: false, items, totalPages, currentPage };
    case ROOM_ERROR:
      return { ...state, loading: false, err: payload };
    default:
      return state;
  }
};
