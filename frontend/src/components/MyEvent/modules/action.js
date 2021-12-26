import * as actionTypes from "./constant";
import axios from "axios";
import { getOwnerRoomAPI } from "../../../api/room.api";

export const actGetRoom = () => {
  return (dispatch) => {
    dispatch(actGetRoomRequest());
    getOwnerRoomAPI()
      .then((result) => {
        dispatch(actGetRoomSuccess(result));
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
