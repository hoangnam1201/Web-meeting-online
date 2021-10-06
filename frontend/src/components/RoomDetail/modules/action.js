import * as actionTypes from "./constant";
import axios from "axios";

export const actGetTable = (roomID) => {
  const accessToken = localStorage
    ? JSON.parse(localStorage.getItem("user"))
    : "";
  return (dispatch) => {
    dispatch(actGetTableRequest());
    axios({
      url: `http://localhost:3002/api/table/get-by-room/${roomID}`,
      method: "GET",
      headers: {
        Authorization: `token ${accessToken.accessToken}`,
      },
    })
      .then((result) => {
        dispatch(actGetTableSuccess(result.data));
      })
      .catch((error) => {
        dispatch(actGetTableFailed(error));
      });
  };
};

const actGetTableRequest = () => {
  return {
    type: actionTypes.GET_TABLE_REQUEST,
  };
};

const actGetTableSuccess = (payload) => {
  return {
    type: actionTypes.GET_TABLE_SUCCESS,
    payload,
  };
};

const actGetTableFailed = (error) => {
  return {
    type: actionTypes.GET_TABLE_FAILED,
    payload: error,
  };
};
export const actGetMember = () => {
  const accessToken = localStorage
    ? JSON.parse(localStorage.getItem("user"))
    : "";
  return (dispatch) => {
    dispatch(actGetMemberRequest());
    axios({
      url: `http://localhost:3002/api/room/invited-room`,
      method: "GET",
      headers: {
        Authorization: `token ${accessToken.accessToken}`,
      },
    })
      .then((result) => {
        dispatch(actGetMemberSuccess(result.data));
      })
      .catch((error) => {
        dispatch(actGetMemberFailed(error));
      });
  };
};

const actGetMemberRequest = () => {
  return {
    type: actionTypes.GET_MEMBER_REQUEST,
  };
};

const actGetMemberSuccess = (payload) => {
  return {
    type: actionTypes.GET_MEMBER_SUCCESS,
    payload,
  };
};

const actGetMemberFailed = (error) => {
  return {
    type: actionTypes.GET_MEMBER_FAILED,
    payload: error,
  };
};
