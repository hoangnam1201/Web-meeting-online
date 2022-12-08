import { getInfoAPI } from "../../api/user.api";

export const USER_SET_USER_INFO = 'USER_SET_USER_INFO';
export const USER_LOADING = 'USER_LOADING';

export const setUserInfo = (payload) => {
  return {
    type: USER_SET_USER_INFO,
    payload
  }
}

const setUserLoading = () => {
  return {
    type: USER_LOADING
  }
}

export const getUserInfo = () => {
  return (dispatch) => {
    dispatch(setUserLoading())
    getInfoAPI().then((res) => {
      dispatch(setUserInfo(res.data));
    });
  }
}

export const actionRemoveUserInfo = () => {
  return (dispatch) => {
    dispatch(setUserInfo(null));
  }
}