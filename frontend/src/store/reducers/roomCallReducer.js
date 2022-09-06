import {
  ROOMCALL_SHOWCHAT,
  ROOMCALL_LOADING,
  ROOMCALL_SHOWLOBBY,
} from "../actions/roomCallAction";

const initState = {
  loading: false,
  showChat: false,
  showLobby: false,
};

export const roomCallReducer = (state = initState, { type, payload }) => {
  switch (type) {
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
