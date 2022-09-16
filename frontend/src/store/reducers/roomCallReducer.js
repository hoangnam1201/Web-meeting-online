import {
  ROOMCALL_SHOWCHAT,
  ROOMCALL_LOADING,
  ROOMCALL_SHOWLOBBY,
  ROOMCALL_SETSOCKET,
  ROOMCALL_SETROOMINFO,
  ROOMCALL_ADDREQUEST,
  ROOMCALL_REMOVEREQUEST,
} from "../actions/roomCallAction";

const initState = {
  roomInfo: null,
  socket: null,
  loading: false,
  showChat: false,
  showLobby: false,
  requests: {},
  buzz: null,
};

export const roomCallReducer = (state = initState, { type, payload }) => {
  switch (type) {
    case ROOMCALL_ADDREQUEST:
      state.requests[payload.user._id] = payload;
      return { ...state, requests: { ...state.requests } };
    case ROOMCALL_REMOVEREQUEST:
      delete state.requests[payload];
      return { ...state, requests: { ...state.requests } };
    case ROOMCALL_SETSOCKET:
      return { ...state, socket: payload };
    case ROOMCALL_SETROOMINFO:
      return { ...state, roomInfo: payload };
    case ROOMCALL_SHOWCHAT:
      return { ...state, showChat: payload };
    case ROOMCALL_LOADING:
      return { ...state, loading: true };
    case ROOMCALL_SHOWLOBBY:
      return { ...state, showLobby: payload };
    default:
      return state;
  }
};
