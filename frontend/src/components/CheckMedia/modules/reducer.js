import * as actionTypes from "./constant";

const initialState = {
  socket: null,
  isConnect: false,
};

export const socketRoomReducer = (state = initialState, { payload, type }) => {
  switch (type) {
    case actionTypes.SOCKET_CONNECT:
      state.isConnect = true;
      state.socket = payload;
      return { ...state };
    case actionTypes.SOCKET_DISCONNECT:
      state.isConnect = false;
      state.socket = null;
      return { ...state };
    default:
      return { ...state };
  }
};
