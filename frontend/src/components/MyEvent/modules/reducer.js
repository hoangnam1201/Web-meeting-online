import * as actionTypes from "./constant";

const initialState = {
  loading: false,
  data: null,
  error: null,
};

export const listRoomReducer = (state = initialState, { payload, type }) => {
  switch (type) {
    case actionTypes.GET_ROOM_REQUEST:
      state.loading = true;
      state.error = null;
      return { ...state };
    case actionTypes.GET_ROOM_SUCCESS:
      state.loading = false;
      state.data = payload;
      state.error = null;
      return { ...state };
    case actionTypes.GET_ROOM_FAILED:
      state.loading = false;
      state.data = null;
      state.error = payload;
      return { ...state };
    default:
      return state;
  }
};
