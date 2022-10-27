import { USER_LOADING, USER_SET_USER_INFO } from "../actions/userInfoAction";

const initialState = {
  loading: false,
  user: null
}

export const userReducer = (state = initialState, { type, payload }) => {
  switch (type) {
    case USER_SET_USER_INFO:
      return { user: payload, loading: false };
    case USER_LOADING:
      return { ...state, loading: true }
    default:
      return state;
  }
};
