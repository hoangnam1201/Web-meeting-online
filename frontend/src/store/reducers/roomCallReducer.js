import {
  ROOMCALL_SHOWCHAT,
  ROOMCALL_SHOWLOBBY,
  ROOMCALL_SETSOCKET,
  ROOMCALL_SETROOMINFO,
  ROOMCALL_ADDREQUEST,
  ROOMCALL_REMOVEREQUEST,
  ROOMCALL_SETPEERID,
  ROOMCALL_JOINLOADING,
  ROOMCALL_SETSELETEDTABLE,
  ROOMCALL_CHATLOADING,
} from "../actions/roomCallAction";

const initState = {
  //socket,
  socket: null,
  // peerId
  myId: null,
  // room
  roomInfo: null,
  showChat: false,
  showLobby: false,
  requests: {},
  buzz: null,
  //seleted
  selectedTable: null,
  //loading
  loading: false,
  chatLoading: false,
  joinLoading: false,
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
    case ROOMCALL_SETPEERID:
      return { ...state, myId: payload };
    case ROOMCALL_SHOWLOBBY:
      return { ...state, showLobby: payload };
    case ROOMCALL_JOINLOADING:
      const selectedTable = payload ? state.selectedTable : null;
      return { ...state, joinLoading: payload, selectedTable }
    case ROOMCALL_CHATLOADING:
      return { ...state, chatLoading: payload }
    case ROOMCALL_SETSELETEDTABLE:
      return { ...state, selectedTable: payload }
    default:
      return state;
  }
};
