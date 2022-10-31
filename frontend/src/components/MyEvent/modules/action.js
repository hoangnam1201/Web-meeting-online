import * as actionTypes from "./constant";
import {
  createRoomApi,
  deleteRoomAPI,
  getOwnerRoomAPI,
  updateRoomApi,
} from "../../../api/room.api";

export const actGetRoom = () => {
  return (dispatch) => {
    dispatch(actGetRoomRequest());
    getOwnerRoomAPI()
      .then((result) => {
        dispatch(actGetRoomSuccess(result.data));
      })
      .catch((error) => {
        dispatch(actGetRoomFailed(error));
      });
  };
};

const actGetRoomRequest = () => {
  return {
    type: actionTypes.GET_ROOM_REQUEST,
  };
};

const actGetRoomSuccess = (payload) => {
  return {
    type: actionTypes.GET_ROOM_SUCCESS,
    payload,
  };
};

const actGetRoomFailed = (error) => {
  return {
    type: actionTypes.GET_ROOM_FAILED,
    payload: error,
  };
};

export const updateRoomAction = (id, data, callBack) => {
  return (dispatch) => {
    dispatch(actGetRoomRequest());
    updateRoomApi(id, data)
      .then(() => {
        dispatch(actGetRoom());
        callBack && callBack("success");
      })
      .catch((error) => {
        callBack && callBack("error");
      });
  };
};

export const addRoomAction = (data, callBack) => {
  return (dispatch) => {
    dispatch(actGetRoomRequest());
    createRoomApi(data)
      .then(() => {
        dispatch(actGetRoom());
        callBack && callBack("success");
      })
      .catch((error) => {
        callBack && callBack("error");
      });
  };
};

export const deleteRoomAction = (id, callBack) => {
  return (dispatch) => {
    dispatch(actGetRoomRequest());
    deleteRoomAPI(id)
      .then(() => {
        dispatch(actGetRoom());
        callBack && callBack("success");
      })
      .catch((error) => {
        callBack && callBack("error");
      });
  };
};
