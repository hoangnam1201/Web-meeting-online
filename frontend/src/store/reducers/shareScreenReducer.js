import { SHARESCREEN_SETSTATE } from "../actions/shareScreenAction";

export const shareScreenReducer = (state = { isSharing: false }, { type, payload }) => {
  switch (type) {
    case SHARESCREEN_SETSTATE:
      return { ...state, isSharing: payload };
    default:
      return state
  }
}