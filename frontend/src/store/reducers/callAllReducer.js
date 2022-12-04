import { CALLALL_LOADING, CALLALL_SETCALLALL, CALLALL_SETHOSTSHARESTREAM, CALLALL_SETHOSTSTREAM } from "../actions/callAllAction";

const initState = {
  isCallAll: false,
  hostShareStream: null,
  hostStream: null,
  loading: false,
}
export const callAllReducer = (state = initState, { type, payload }) => {
  switch (type) {
    case CALLALL_LOADING:
      return { ...state, loading: true };
    case CALLALL_SETCALLALL:
      return { ...state, isCallAll: payload, loading: false };
    case CALLALL_SETHOSTSTREAM:
      return { ...state, hostStream: payload };
    case CALLALL_SETHOSTSHARESTREAM:
      return { ...state, hostShareStream: payload };
    default:
      return state;
  }
}