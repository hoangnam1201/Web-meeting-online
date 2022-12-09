import {
  GET_ROOM_FAILED,
  GET_ROOM_REQUEST,
  GET_ROOM_SUCCESS,
} from "./constant";
import {
  createRoomApi,
  deleteRoomAPI,
  getOwnerRoomAPI,
  updateRoomApi,
} from "../../../api/room.api";
import { toast } from "react-toastify";
import { toastError } from "../../../services/toastService";

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
    type: GET_ROOM_REQUEST,
  };
};

const actGetRoomSuccess = (data) => {
  return {
    type: GET_ROOM_SUCCESS,
    payload: data,
  };
};

const actGetRoomFailed = (error) => {
  return {
    type: GET_ROOM_FAILED,
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
        dispatch(actGetRoomFailed(error));
        toastError(error?.response?.data?.msg)
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
