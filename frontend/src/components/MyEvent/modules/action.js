import * as actionTypes from "./constant";
import axios from "axios";
import { Cookies } from 'react-cookie';

export const actGetRoom = () => {
  const accessToken = new Cookies().get('u_auth');
  return (dispatch) => {
    dispatch(actGetRoomRequest());
    axios({
      url: `http://ec2-54-161-198-205.compute-1.amazonaws.com:3002/api/room/owned-room`,
      method: "GET",
      headers: {
        Authorization: `token ${accessToken.accessToken}`,
      },
    })
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
