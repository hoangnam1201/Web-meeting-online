import {
  GET_ROOM_FAILED,
  GET_ROOM_REQUEST,
  GET_ROOM_SUCCESS,
} from "./constant";

const initialState = {
  loading: false,
  data: [],
  error: null,
};

export const listRoomReducer = (state = initialState, { payload, type }) => {
  switch (type) {
    case GET_ROOM_REQUEST:
      return { ...state, loading: true };
    case GET_ROOM_SUCCESS:
      return { ...state, loading: false, data: payload };
    case GET_ROOM_FAILED:
      return { ...state, loading: false, error: payload };
    default:
      return state;
  }
};
