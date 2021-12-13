import { REMOVE_USER_INFO, SET_USER_INFO } from "../actions/userInfoAction";

const initialState = {
  loaded: false,
  user: null
}

export const userReducer = (state = initialState, { type, payload }) => {
  switch (type) {
    case SET_USER_INFO:
      return { user: payload, loaded: true };
    case REMOVE_USER_INFO:
      return { user: null, loaded: false };
    default:
      return state;
  }
};
