import {
  ROOMCALL_SHOWCHAT,
  ROOMCALL_SHOWLOBBY,
  ROOMCALL_SETSOCKET,
  ROOMCALL_SETROOMINFO,
  ROOMCALL_ADDREQUEST,
  ROOMCALL_SETPEERID,
  ROOMCALL_JOINLOADING,
  ROOMCALL_SETSELETEDTABLE,
  ROOMCALL_CHATLOADING,
  ROOMCALL_SETREQUESTLOADING,
  ROOMCALL_SETREQUEST,
  ROOMCALL_SHOWQUIZS,
  ROOMCALL_SETSHARING,
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
  showQuizs: false,
  buzz: null,
  //seleted
  selectedTable: null,
  //loading
  loading: false,
  chatLoading: false,
  joinLoading: false,
  //requests
  requests: [],
  requestLoading: false,
  //share
  sharing: false,
};

export const roomCallReducer = (state = initState, { type, payload }) => {
  switch (type) {
    case ROOMCALL_SETSOCKET:
      return { ...state, socket: payload };
    case ROOMCALL_SETROOMINFO:
      return { ...state, roomInfo: payload };
    case ROOMCALL_SHOWCHAT:
      return { ...state, showChat: payload };
    case ROOMCALL_SHOWQUIZS:
      return { ...state, showQuizs: payload };
    case ROOMCALL_SETPEERID:
      return { ...state, myId: payload };
    case ROOMCALL_SHOWLOBBY:
      return { ...state, showLobby: payload };
    case ROOMCALL_SETSHARING:
      return { ...state, sharing: payload };
    case ROOMCALL_JOINLOADING:
      const selectedTable = payload ? state.selectedTable : null;
      return { ...state, joinLoading: payload, selectedTable }
    case ROOMCALL_CHATLOADING:
      return { ...state, chatLoading: payload }
    case ROOMCALL_SETSELETEDTABLE:
      return { ...state, selectedTable: payload }
    case ROOMCALL_SETREQUESTLOADING:
      return { ...state, requestLoading: payload }
    case ROOMCALL_SETREQUEST:
      return { ...state, requestLoading: false, requests: payload }
    case ROOMCALL_ADDREQUEST:
      return { ...state, requests: [...state.requests, payload] };
    default:
      return state;
  }
};
