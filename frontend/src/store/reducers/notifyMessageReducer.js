import {
  NOTIFY_MESSAGE_FALSE,
  NOTIFY_MESSAGE_TRUE,
} from "../actions/messageAction";

const initState = { isReceive: false };
export const notifyMessageReducer = (state = initState, { type, payload }) => {
  switch (type) {
    case NOTIFY_MESSAGE_TRUE:
      return { ...state, isReceive: true };
    case NOTIFY_MESSAGE_FALSE:
      return { ...state, isReceive: false };
    default:
      return state;
  }
};
