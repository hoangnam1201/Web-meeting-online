import { getAllUserAPI, updateUserAPI } from "../../api/user.api";

export const USER_REQUEST = "USER_REQUEST";
export const USER_SUCCESS = "USER_SUCCESS";
export const USER_ERROR = "USER_ERROR";
export const USER_SELECTED = "USER_SELECTED";

const userRequest = () => {
  return {
    type: USER_REQUEST,
  };
};

const userError = (err) => {
  return {
    type: USER_ERROR,
    payload: err,
  };
};

const userSuccess = (user) => {
  return {
    type: USER_SUCCESS,
    payload: user,
  };
};
const userSelected = (ids) => {
  return {
    type: USER_SELECTED,
    payload: ids,
  };
};

export const selectedUserAction = (id, callback) => {
  return (dispatch, getState) => {
    const userState = getState().userManageReducer;
    let selectedUser = [];
    const index = userState.selectedUser.indexOf(id);
    if (index !== -1) {
      userState.selectedUser.splice(index, 1);
      selectedUser = [...userState.selectedUser];
    } else {
      selectedUser = [...userState.selectedUser, id];
    }
    dispatch(userSelected(selectedUser));
    if (callback) {
      callback();
    }
  };
};

export const clearSelectedUserAction = () => {
  return (dispatch, getState) => {
    const { selectedUser } = getState().userManageReducer;
    if (selectedUser.length) return dispatch(userSelected([]));
  };
};

export const searchUserAction = (pageIndex, searchStr, callback) => {
  return async (dispatch) => {
    dispatch(userRequest());
    try {
      dispatch(getUserPagingAction(pageIndex, searchStr));
      callback && callback();
    } catch (err) {
      console.log(err);
      if (err.response) {
        dispatch(userError(err.response));
        return;
      }
      dispatch(userError("Error network"));
    }
  };
};

export const getUserPagingAction = (pageIndex, searchStr, role) => {
  return async (dispatch) => {
    dispatch(userRequest());
    try {
      const pageSize = 10;
      const res = await getAllUserAPI(pageSize, pageIndex, searchStr, role);
      const { records, count = 0 } = res.data;
      dispatch(
        userSuccess({
          items: records,
          totalPages: Math.ceil(count / pageSize),
          currentPage: pageIndex,
        })
      );
    } catch (err) {
      console.log(err);
      if (err.response) {
        dispatch(userError(err.response));
        return;
      }
      dispatch(userError("Error network"));
    }
  };
};

export const updateUserAction = (data, pageIndex, callback) => {
  return async (dispatch) => {
    dispatch(userRequest());
    try {
      await updateUserAPI(data);
      dispatch(getUserPagingAction(pageIndex));
      dispatch(clearSelectedUserAction());
      callback && callback();
    } catch (err) {
      console.log(err);
      if (err.response) {
        dispatch(userError(err.response));
        return;
      }
      dispatch(userError("Error network"));
    }
  };
};
